import { Field, Poseidon, ZkProgram, SelfProof, method} from "o1js";


export async function MerkleRoot(leaves: [Field, Field, Field, Field, Field, Field, Field, Field, Field]) {



 const MerkleRootProgram = ZkProgram({
  name: "MerkleRootProgram",
  publicOutput: Field,
  methods: {
    // Base case: return a dummy root
    baseCase: {
      privateInputs: [],
      method: async () => {
        return { publicOutput: Field(0) };
      } 
    },

    // Add method: takes previous proof + 8 leaves, computes full 3-level Merkle root
    add: {
      privateInputs: [SelfProof, Field, Field, Field, Field, Field, Field, Field, Field],   
      method: async (
        previous: SelfProof<undefined, Field>,
        l0: Field, l1: Field, l2: Field, l3: Field,
        l4: Field, l5: Field, l6: Field, l7: Field
      ) => {
        previous.verify();

        // --- Level 1: hash leaf pairs ---
        const level1: [Field, Field, Field, Field] = [
          Poseidon.hash([l0, l1]),
          Poseidon.hash([l2, l3]),
          Poseidon.hash([l4, l5]),
          Poseidon.hash([l6, l7])
        ];

        // --- Level 2: hash pairs of Level 1 ---
        const level2: [Field, Field] = [
          Poseidon.hash([level1[0], level1[1]]),
          Poseidon.hash([level1[2], level1[3]])
        ];

        // --- Level 3: root ---
        const root: Field = Poseidon.hash([level2[0], level2[1]]);

        return { publicOutput: root };
      }
    }
  }
});
    
    await MerkleRootProgram.compile();

    const base = await MerkleRootProgram.baseCase();

    const merkleComputation = await MerkleRootProgram.add(  
     base.proof,
     leaves[1],
     leaves[2],
     leaves[3],
     leaves[4],
     leaves[5],
     leaves[6],
     leaves[7],
     leaves[8]
  );

    
   const rootField = merkleComputation.auxiliaryOutput;
   console.log(rootField);  

    

}