import type { Request, Response } from "express";
import { prepareMerkleRootForCircom } from "../zk_circuit/zkcircuit2.ts";
import { generateRandomSiblings } from "../services/newSiblings.ts";
import { PrismaClient } from "../generated/prisma/client.ts";
import { import_adapter } from "../PrismaClient.ts";

// Simple test route
export const JustHelloTest = async (req: Request, res: Response) => {
  res.send("Hello from our team");
};

// Route to get a leaf (debug version)
export const getLeaf = async (req: Request, res: Response) => {
  try {
    const leaf_string  = req.body.leaf; // JSON request body

    if (leaf_string === undefined || leaf_string === null) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: leaf",
      });
    }

    const siblings: bigint[] = generateRandomSiblings();
    const leaf_BigInt = BigInt(leaf_string);
    siblings.push(leaf_BigInt);

    const root = prepareMerkleRootForCircom(siblings);
    console.log("Computed Merkle Root:", root);

  
  
    res.status(200).json({
      success: true,
      ///leafReceived: leaf_string,
      siblingsCount: siblings.length,
      root_message: root.root.toString()
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 


