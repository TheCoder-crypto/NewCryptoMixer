import { keccak_256 } from "@noble/hashes/sha3.js";
import { randomBytes } from "crypto";

// Generates exactly 7 random siblings as BigInt
export function generateRandomSiblings(): bigint[] {
    const siblings: bigint[] = [];

    for (let i = 0; i < 7; i++) {
        const randomMsg = randomBytes(32);
        const randomHash = keccak_256(randomMsg);
        siblings.push(BigInt("0x" + Buffer.from(randomHash).toString("hex")));
    }

    return siblings; // array of 7 BigInt
}

// Test
const another_one = generateRandomSiblings();
console.log("SIBLINGS:", another_one);




