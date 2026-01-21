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
    const  leaf  = req.body.leaf; // JSON request body

    if (leaf === undefined || leaf === null) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: leaf",
      });
    }

    // Convert leaf to bigint
   /* let leafBigInt: string;
    try {
      leafBigInt = leaf;
    } catch {
      return res.status(400).json({
        success: false,
        message: "Leaf must be a valid integer string",
      });
    }
  */    

    // Debug response (no siblings / root)
    return res.status(200).json({
      success: true,
      leafReceived: leaf,
    });


  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'something went wrong but',
    });
  }
};


    // Generate random siblings and include the actual leaf
    
    /*
    const siblings: bigint[] = generateRandomSiblings();
    siblings.push(leafBigInt);

    // Initialize Prisma (consider reusing client in production)
    ///const adapter = import_adapter();
    ///const prisma = new PrismaClient({adapter});

    // Compute Merkle root
    const root = prepareMerkleRootForCircom(siblings);
    console.log("Computed Merkle Root:", root);

    */



    /*
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

*/
