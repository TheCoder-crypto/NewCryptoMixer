import { keccak256  } from "ethers";

/**
 * Simple hash function for Merkle tree.
 * You can use keccak256 or Poseidon if you have a JS implementation.
 * Here we hash BigInt leaves by converting to 32-byte hex.
 */
function hashPair(a: bigint, b: bigint): bigint {     ///// a funciton hashPait takes as input 2 big(integer but much bigger in size)n returns a biginteger as well
  const buffer = Buffer.concat([                               //////// creates a buffer by concatenating the 2 bigints after converting them to 32-byte hex representation
    Buffer.from(a.toString(16).padStart(64, "0"), "hex"),
    Buffer.from(b.toString(16).padStart(64, "0"), "hex")
  ]);
  const hashHex = keccak256(buffer); // 0x prefixed   ////// applies keccak256 to the buffer and gets a hex string
  return BigInt(hashHex); // convert to BigInt       ////// casts the hex back into a BigInt and returns it, not sure how it works with the leading 0x
}

/**
 * Compute Merkle root for arbitrary array of leaves (bigints)
 * Pads the tree to next power of 2 with zeros if necessary
 */
export function computeMerkleRoot(leaves: bigint[]): bigint {    /// computeMerkleRoot takes an array leaves of big ibntegers as input and returns a big integer as output
  if (leaves.length === 0) throw new Error("No leaves provided");   //// should be deleted

  // Pad to next power of 2
  const n = leaves.length;      ///// extrcats the number of leaves
  const nextPow2 = 1 << Math.ceil(Math.log2(n));   //// checks what is the next power of 2 greater than n by taking log base 2 of n, rounding it up and then raising 2 to that power
  const paddedLeaves = [...leaves];  /// completes the leaves array by copying its elements into a new array
  while (paddedLeaves.length < nextPow2) {  ////
    paddedLeaves.push(0n);  /// this will add 0n (bigint zero) to the array until its length is equal to next power of 2
  }

  let currentLevel = paddedLeaves;  / //// initializes currentLevel to be the padded leaves

  while (currentLevel.length > 1) {
    const nextLevel: bigint[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      nextLevel.push(hashPair(currentLevel[i]!, currentLevel[i + 1]!));
    }
    currentLevel = nextLevel;
  }

  return currentLevel[0]!;
}


/// Convert bigint → 32-byte array
 
export function bigintToBytes(x: bigint): number[] {
  const hex = x.toString(16).padStart(64, "0");
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
}

/**
 * Convert hex string → bits array
 */
export function hexToBits(hex: string): number[] {
  const bytes = Buffer.from(hex.slice(2), "hex");
  const bits: number[] = [];
  for (const byte of bytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1);
    }
  }
  return bits;
}

/**
 * Full pipeline: compute Merkle root, bytes, keccak hash, bits
 */
export function prepareMerkleRootForCircom(leaves: bigint[]) {
  const root = computeMerkleRoot(leaves);
  const rootBytes = bigintToBytes(root);
  const rootHex = "0x" + Buffer.from(rootBytes).toString("hex");
  const keccakHash = keccak256(rootHex);
  const hashBits = hexToBits(keccakHash);

  return {
    root,
    rootBytes,
    keccakHash,
    hashBits
  };
}

// --- Example usage ---
const leaves = [1n, 2n, 3n, 4n, 5n]; // arbitrary bigint leaves
const result = prepareMerkleRootForCircom(leaves);
console.log(result);
