import { prepareMerkleRootForCircom } from "../src/zk_circuit/zkcircuit2.ts";


function testing_merkle(number: bigint[]) {


    const merkle_preparation = prepareMerkleRootForCircom(number);
    console.log("Merkle Root BigInt"); 

}


testing_merkle([ 123456789012345678901234567890n, 
                 987654321098765432109876543210n,
                 112233445566778899001122334455n])







 