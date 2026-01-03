import {Field} from "o1js"
import { Int64 } from "o1js";
import { Poseidon } from "o1js";
import { ZkProgram } from "o1js";
import { SelfProof } from "o1js";




const ExampleProgram = ZkProgram({
  name: 'ExampleProgram',
  publicOutput: Field,
  methods: {
    baseCase: {
      privateInputs: [],
      method: async () => {
        return { publicOutput: Field(0) }
      }
    },
    add: {
      privateInputs: [SelfProof, Field],
      // `previous` is the type of proof produced by ExampleProgram
      method: async (previous: SelfProof<undefined, Field>, f: Field) => {
        previous.verify();
        return { publicOutput: previous.publicOutput.add(f) }
      }
    }
  }
});
