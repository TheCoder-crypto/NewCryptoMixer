import { Request, Response } from "express";
import { generateRandomSiblings } from "../services/newSiblings.js"
import { MerkleRootHash } from "../zk_circuit/zk_circuit.js";
import { Field, ZkProgram } from 'o1js';

export const getHome = (req: Request, res: Response) => {
  res.send("Hello from My Privacy Mixer:");
};

export const getLeaf = async (req: Request, res: Response) => {
  try {
    const { leaf } = req.body;

    if (!leaf) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: leaf",
      });
    }

    // For now just return it — you can plug in your logic next
    res.status(200).json({
      success: true,
      leafReceived: leaf
    });

    // --- Your logic after response ---
    const leaf_bytes = Uint8Array.from(Buffer.from(leaf, "hex"));

    const siblings_creation = generateRandomSiblings(leaf_bytes);
    const leavesFields = siblings_creation.map(s => Field.fromBytes(s));
    const merkleComputation = await MerkleRootHash.merkleRoot.method(leavesFields);

    const merkleRoot = merkleComputation.publicOutput;
    console.log("Merkle root:", merkleRoot.toString());

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
