import { network } from "hardhat";
const { ethers, networkHelpers } = await network.connect();



const id = await ethers.provider.getNetwork();


console.log("Network:", id);


