import { network } from "hardhat";
const { ethers, networkHelpers } = await network.connect();


const chainId = await network.provider.send("eth_chainId");
const id = await ethers.provider.getNetwork();


console.log("Network:", id);


