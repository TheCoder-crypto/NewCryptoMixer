pragma circom 2.2.3;

include "../../node_modules/circomlib/circuits/poseidon.circom";

template HashingInput() {
    signal input client;
    signal output hash;

    component hasher = Poseidon(1); // 1 input
    hasher.inputs[0] <== client;

    hash <== hasher.out;
}


component main = HashingInput();