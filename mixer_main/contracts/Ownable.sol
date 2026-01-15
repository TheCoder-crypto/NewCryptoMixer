// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";


contract OwnerShip is Ownable { 

    constructor(address initialOwner)    
    Ownable(initialOwner) {} ////// interesting what is happenign here, i mean i understand constructor in that way, but Ownable(initialOwner)


    function get_owner() public view returns (address) {
        return owner();
    }
   


}

contract New_Ownership is OwnerShip {
    constructor(address same_owner)
    OwnerShip(same_owner) 
    {}

    function changeOwner(address newOwner) public onlyOwner {
        transferOwnership(newOwner);
    }
}
/////if the new one inherits from the old one it will do the same things as the old one.
//// oke it allows for transferforOwnership from the last guy
