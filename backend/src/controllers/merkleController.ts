import { Request, Response } from "express";
import { prepareMerkleRootForCircom } from '../zk_circuit/zkcircuit2.js';
import { generateRandomSiblings } from "../services/newSiblings.js";
import { PrismaClient } from "../generated/prisma/client.js";

// Simple test route
export const JustHelloTest = async (req: Request, res: Response) => {
  res.send("Hello from our team");
};

// Route to get a leaf and compute Merkle root
export const getLeaf = async (req: Request, res: Response) => {
  try {
    const { leaf } = req.body;

    if (!leaf) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: leaf",
      });
    }

    // Convert leaf to bigint
    let leafBigInt: bigint;
    try {
      leafBigInt = BigInt(leaf);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Leaf must be a valid integer string",
      });
    }

    // Generate random siblings and include the actual leaf
    const siblings: bigint[] = generateRandomSiblings(leafBigInt);
    siblings.push(leafBigInt);

    // Initialize Prisma (consider reusing client in production)
    const prisma = new PrismaClient();

    // Compute Merkle root
    const root = prepareMerkleRootForCircom(siblings);
    console.log("Computed Merkle Root:", root);

    res.status(200).json({
      success: true,
      leafReceived: leaf,
      siblingsCount: siblings.length,
      root
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
