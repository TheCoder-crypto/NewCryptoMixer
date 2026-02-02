import { expect } from "chai";
import type { Signer } from "ethers";
import hre from "hardhat";
import { task } from "hardhat/config";
import { network } from "hardhat";
import { Await } from "react-router-dom";
import { Groth16Verifier__factory } from "../types/ethers-contracts/index.js";

const { ethers, networkHelpers } = await network.connect();




const signers = await ethers.getSigners();
const deployer = signers[0];



const deployed_verifier = new Groth16Verifier__factory(deployer);
/////const final_address = await deployed_verifier.deploy();

////console.log("This is the final address deployed", final_address);

let contract_migration = await deployed_verifier.connect(deployer).deploy()
const contract_final = await contract_migration.getAddress();
console.log("Final contract address", contract_final);