import { Field, Poseidon, ZkProgram, SelfProof } from "o1js";
import { keccak256 } from "ethers/lib/utils";

// Main function
export async function MerkleRoot(leaves: [Field, Field, Field, Field, Field, Field, Field, Field, Field]) {

  // --- Step 1: Define ZK program ---
  const MerkleRootProgram = ZkProgram({
    name: "MerkleRootProgram",
    publicOutput: Field,
    methods: {
      // Base case: return dummy root
      baseCase: {
        privateInputs: [],
        method: async () => {
          return { publicOutput: Field(0) };
        }
      },

      // Add method: compute full 3-level Merkle root
      add: {
        privateInputs: [SelfProof, Field, Field, Field, Field, Field, Field, Field, Field],
        method: async (
          previous: SelfProof<undefined, Field>,
          l0: Field, l1: Field, l2: Field, l3: Field,
          l4: Field, l5: Field, l6: Field, l7: Field
        ) => {
          previous.verify();

          // Level 1: hash leaf pairs
          const level1: [Field, Field, Field, Field] = [
            Poseidon.hash([l0, l1]),
            Poseidon.hash([l2, l3]),
            Poseidon.hash([l4, l5]),
            Poseidon.hash([l6, l7])
          ];

          // Level 2: hash pairs of Level 1
          const level2: [Field, Field] = [
            Poseidon.hash([level1[0], level1[1]]),
            Poseidon.hash([level1[2], level1[3]])
          ];

          // Level 3: root
          const root: Field = Poseidon.hash([level2[0], level2[1]]);
          return { publicOutput: root };
        }
      }
    }
  });

  // --- Step 2: Compile program ---
  await MerkleRootProgram.compile();

  // --- Step 3: Compute base proof and Merkle root ---
  const base = await MerkleRootProgram.baseCase();
  const merkleComputation = await MerkleRootProgram.add(
    base.proof,
    leaves[0], leaves[1], leaves[2], leaves[3],
    leaves[4], leaves[5], leaves[6], leaves[7]
  );

  const rootField = merkleComputation.

  // --- Step 4: Convert Field → bytes ---
  function fieldToBytes(root: Field): number[] {
    const rootBigInt = root.toBigInt();
    const rootHex = rootBigInt.toString(16).padStart(64, '0'); // 32 bytes
    const rootBytes: number[] = [];
    for (let i = 0; i < rootHex.length; i += 2) {
      rootBytes.push(parseInt(rootHex.slice(i, i + 2), 16));
    }
    return rootBytes;
  }

  const rootBytes = fieldToBytes(rootField);
  console.log("Merkle root as bytes:", rootBytes);

  // --- Step 5: Hash bytes with Keccak ---
  const rootHex = '0x' + Buffer.from(rootBytes).toString('hex');
  const keccakHash = keccak256(rootHex);
  console.log("Keccak hash of Merkle root:", keccakHash);

  // --- Step 6: Optional - convert hash to bits for Circom ---
  function hexToBits(hex: string): number[] {
    const bytes = Buffer.from(hex.slice(2), 'hex');
    const bits: number[] = [];
    for (let byte of bytes) {
      for (let i = 7; i >= 0; i--) {
        bits.push((byte >> i) & 1);
      }
    }
    return bits;
  }

  const hashBits = hexToBits(keccakHash);
  console.log("Bits ready for Circom input:", hashBits.length); // 256 bits

  // --- Step 7: Return everything needed for next circuit ---
  return {
    rootField,
    rootBytes,
    keccakHash,
    hashBits
  };
}
