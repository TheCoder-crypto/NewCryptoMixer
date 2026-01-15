import { expect } from "chai";
import type { Signer } from "ethers";
import { LogicMain__factory } from "../types/ethers-contracts/factories/Mixer.sol/LogicMain__factory.js";
import hre from "hardhat";
import { task } from "hardhat/config";
import { network } from "hardhat";
import { Await } from "react-router-dom";

const { ethers, networkHelpers } = await network.connect();

describe("MixerMain test running to check for possible weaknesses or Logic flaws", function(){ 

    it("get funded accounts", async function () {

        /* ---------------- SETUP ---------------- */

        const signers = await ethers.getSigners();

        const deployer = signers[0];
        const attacker = signers[1];
        const deployer2 = signers[2];
        const adminEarner = signers[3];

        const address_deployment_factory = new LogicMain__factory(deployer);
        const final_address = await address_deployment_factory.deploy(
            deployer.address,
            deployer2.address,
            adminEarner.address
        );

        /* ---------------- DEPLOYMENT CHECKS ---------------- */

        const owner = await final_address.get_owner();
        const balance = await ethers.provider.getBalance(deployer.address);
        const balance_eth = ethers.formatEther(balance);

        console.log("Owner:", owner);
        console.log("Deployer balance:", balance_eth);

        
    });

});



















