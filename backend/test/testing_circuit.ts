import { Field } from "o1js";
import { randomBytes } from "crypto";
import pkg from 'js-sha3';
const { keccak_256 } = pkg;
import { MerkleRoot } from "../src/zk_circuit/zk_circuit.ts";

// Global storage for leaves + siblings
const storage: Field[] = [];

// Helper: convert a string to a Field safely
function hashToField(msgStr: string): Field {
    const msgBytes = new TextEncoder().encode(msgStr);              // string → bytes
    const hashBytes = keccak_256.array(msgBytes);                   // 32-byte hash
    const bigIntHash = BigInt("0x" + Buffer.from(hashBytes).toString("hex")); // bytes → bigint
    const fieldLeaf = Field(bigIntHash % Field.ORDER);             // reduce modulo field prime
    storage.push(fieldLeaf);                                        // store globally
    return fieldLeaf;
}

// Prepare a leaf from a string
function prepareLeaf(x: string): Field {
    return hashToField(x);
}

// Prepare N random siblings
function prepareSiblings(count: number): Field[] {
    const siblings: Field[] = [];
    for (let i = 0; i < count; i++) {
        const randomMsg = randomBytes(32);                          // random 32 bytes
        const randomHash = keccak_256.array(randomMsg);             // hash it
        const bigIntHash = BigInt("0x" + Buffer.from(randomHash).toString("hex"));
        const fieldSibling = Field(bigIntHash % Field.ORDER);       // reduce modulo field prime
        siblings.push(fieldSibling);                                 // add to siblings array
        storage.push(fieldSibling);                                  // also push to global storage
    }
    return siblings;
}

// ---------------------- Example usage ----------------------

// 1) Prepare the main leaf
const mainLeaf = prepareLeaf("my special leaf");

// 2) Prepare 8 random siblings
const siblings = prepareSiblings(8);

// 3) Combine into array for circuit
const leavesForCircuit: Field[] = [mainLeaf, ...siblings];



const root = await MerkleRoot(leavesForCircuit as [
  Field, Field, Field, Field, Field,
  Field, Field, Field, Field
]);

console.log("circuit executed succesfully");








 