import { expect } from "chai";
import type { Signer } from "ethers";
import { OwnerShip__factory } from "../types/ethers-contracts/factories/Ownable.sol/OwnerShip__factory.js";
import { New_Ownership__factory } from "../types/ethers-contracts/factories/Ownable.sol/New_Ownership__factory.js";
import hre from "hardhat";
import { task } from "hardhat/config";
import { network } from "hardhat";
import { Await } from "react-router-dom";
const { ethers, networkHelpers } = await network.connect();

describe("Ownership Robustness", function () {

  // --- Global variables accessible in all tests ---
  let privateOwner = "0x6ff29d7780ea58ba32079f2458d94ff7b8764f1089c9b0d455f85f3d883fcf31";
  let privateFutureOwner = "0x79cbf30751dec2d0aef0433ead9ef29e687f9cf02c17b4c686cf33897f5fdba5";
  let privateHacker = "0x803503a12788d965a41b005489527a65257e0d112b933ccc16c600f998085e76";

  let walletOwner;   // mutable wallet for owner
  let walletFuture;  // mutable wallet for future owner
  let walletHacker;  // mutable wallet for hacker

  let final_address;   // contract factory
  let final_address2;  // deployed contract instance
  let final_address_new;
  let final_address_new2;
  let balance;
  
  let owner_address;
  let new_owner;
  let owner_address2;


  // --- Initialization in a before hook ---
  before(async function () {
    walletOwner = new ethers.Wallet(privateOwner);
    walletFuture = new ethers.Wallet(privateFutureOwner);
    walletHacker = new ethers.Wallet(privateHacker);
  });

  it("should print addresses", function () {
    console.log(walletOwner);
    console.log(walletHacker);
  });

  it("should deploy the contract succesfully", async function() {
    final_address = await ethers.getContractFactory("OwnerShip");
    final_address2 = await final_address.deploy(walletOwner);
    console.log(final_address2);
    
  });

  it("it should print the expected owner", async function() {
    owner_address = await final_address2.get_owner();
    console.log(owner_address)
  })


  it("get the owner of the second contract", async function() {
    final_address_new = await ethers.getContractFactory("New_Ownership");
    final_address_new2 = await final_address_new.deploy(walletOwner);
    owner_address = await final_address_new2.get_owner()
    balance = await ethers.provider.getBalance(owner_address)
    console.log(`this is the address and balance of the account, ${owner_address}, ${balance}`);
  
    



  })

  it("should change the owner", async function() {

   owner_address2 = await final_address_new2.connect(walletOwner).changeOwner(walletFuture);     


  })




});






