import { Field, Poseidon, ZkProgram } from 'o1js';
import { keccak_256 } from "@noble/hashes/sha3.js";
import { randomBytes } from "crypto";
import fs from "fs-extra";
// This function generates an array of 8 hashes:
// first element is the input leaf (already hashed by caller)
// the other 7 are random sibling hashes
export function generateRandomSiblings(leaf: Uint8Array): Uint8Array[] {
    const siblings: Uint8Array[] = [];

    // 1) Push the leaf itself 
    siblings.push(leaf);

    // 2) Generate 7 random sibling hashes
    for (let i = 0; i < 7; i++) {
        const randomMsg = randomBytes(32);          // random bytes
        const randomHash = keccak_256(randomMsg);   // hash them
        siblings.push(Uint8Array.from(randomHash));
    }

    return siblings; // total: 8 items
}

// Example usage: generate the array for the incoming leaf
// (assume `leaf` is received from a listener)
const array = generateRandomSiblings(leaf);

// Zero-knowledge Merkle tree program
const MerkleRootHash = ZkProgram({
  merkleRoot: {
    privateInputs: array,
    method: async (leaves: Field[]) => {
      // --- Level 1: hash leaf pairs --- 
      const nextLevel: Field[] = [];
      for (let i = 0; i < 8; i += 2) {
        const h = Poseidon.hash([leaves[i], leaves[i + 1]]);
        nextLevel.push(h);
      }

      // --- Level 2: hash pairs of Level 1 --- 
      const nextLevel2: Field[] = [];
      for (let i = 0; i < nextLevel.length; i += 2) {
        const h = Poseidon.hash([nextLevel[i], nextLevel[i + 1]]);
        nextLevel2.push(h);
      }

      // --- Level 3: root ---
      const root: Field = Poseidon.hash([nextLevel2[0], nextLevel2[1]]);

      return { publicOutput: root }; // Merkle root
    },
  },
});

// Example: write the siblings to a JSON file
const filename = `merkle_${Buffer.from(leaf).toString('hex')}.json`;
const data = { leaf: Buffer.from(leaf).toString('hex'), siblings: array.map(a => Buffer.from(a).toString('hex')) };

fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8', (err) => {
   if (err) {
      console.error('Error writing file', err);
   } else {
      console.log(`Data saved to ${filename}`);
   }
   rl.close();
});
