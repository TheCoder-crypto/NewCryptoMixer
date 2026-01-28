// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Ownable.sol";

interface IVerifier {   //// verifier function that will be fetched from blockchain
    function verifyProof(
        uint[2] calldata _pA, 
        uint[2][2] calldata _pB, 
        uint[2] calldata _pC, 
        uint[1] calldata _pubSignals
    ) external view returns (bool);                
}

contract LogicMain is New_Ownership, ReentrancyGuard {

    uint256 private earning_admin;   

    address public immutable AdminApprovedWallet;  
    address public immutable AdminEarner;

    uint256 private constant AMOUNT_0_5_ETH = 0.5 ether;
    uint256 private constant AMOUNT_1_ETH   = 1 ether;
    uint256 private constant AMOUNT_5_ETH   = 5 ether;
    uint256 private constant AMOUNT_10_ETH  = 10 ether;

    mapping(bytes32 => uint256) private rootToAmount; 
    mapping(bytes32 => bool) private nullifiers;

    IVerifier public immutable verifier;   // Verifier contract

    event DepositQueued(
        address indexed depositor,
        uint256 amount,
        uint256 timestamp
    );

    event MerkleRootAdded(
        bytes32 indexed merkleRoot,
        uint256 amount
    );
                                             
    constructor(
        address main_owner,
        address adminwallet,
        address adminearner,
        address verifierAddress   // <--- add verifier address
    ) New_Ownership(main_owner) {
        AdminApprovedWallet = adminwallet;
        AdminEarner = adminearner;
        verifier = IVerifier(verifierAddress);   // set verifier
    }

    function add_new_merkle(
        bytes32 merkle_root,
        uint256 amount
    ) external onlyOwner returns (bytes32) {
        require(rootToAmount[merkle_root] == 0, "Root already exists");
        rootToAmount[merkle_root] = amount;
        emit MerkleRootAdded(merkle_root, amount);
        return merkle_root;
    }

    function owner_percentage(uint256 amount) internal returns (bool) {
        uint256 profit = (amount * 1) / 100;
        (bool success1, ) = AdminApprovedWallet.call{value: profit}("");
        (bool success2, ) = AdminEarner.call{value: profit}("");
        require(success1 && success2, "ETH transfer failed");
        return true;
    }

    function emergency_withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = AdminApprovedWallet.call{value: balance}("");
        require(success, "Emergency withdraw failed");
    }

    function deposit() external payable {
        require(
            msg.value == AMOUNT_0_5_ETH ||
            msg.value == AMOUNT_1_ETH   ||
            msg.value == AMOUNT_5_ETH   ||
            msg.value == AMOUNT_10_ETH,
            "Invalid denomination"
        );

        owner_percentage(msg.value);

        uint256 totalShare = (msg.value * 2) / 100;
        earning_admin += (msg.value - totalShare);

        emit DepositQueued(msg.sender, msg.value, block.timestamp);
    }

    function _verify(
        bytes32 merkleRoot,
        bytes32 nullifierHash
    ) internal returns (bool, uint256) {
        uint256 amount = rootToAmount[merkleRoot];
        if (amount == 0) return (false, 0);
        if (nullifiers[nullifierHash]) return (false, 0);
        nullifiers[nullifierHash] = true;
        return (true, amount);
    }

    function withdraw(
        bytes32 merkleRoot,
        bytes32 nullifierHash,
        address payable recipient,
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[1] calldata _pubSignals
    ) external onlyOwner nonReentrant {
        
        // Step 1: Verify zk-SNARK proof first
        bool proofValid = verifier.verifyProof(_pA, _pB, _pC, _pubSignals);  /// checks thee proof result from verifier.sol
        require(proofValid, "Verifier proof failed"); ////// 

        // Step 2: Continue with existing nullifier/root checks
        (bool ok, uint256 amount) = _verify(merkleRoot, nullifierHash);
        require(ok, "Verification failed");

        // Step 3: Transfer ETH
        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "ETH transfer failed");
    }
}
