import type { Request, Response } from "express";
import { prepareMerkleRootForCircom } from "../zk_circuit/zkcircuit2.ts";
import { generateRandomSiblings } from "../services/newSiblings.ts";
import { PrismaClient } from "../generated/prisma/client.ts";
import { import_adapter } from "../PrismaClient.ts";
import { adding_family } from "../services/creating_family.ts"
import * as fs from 'fs';
import { STATUS_CODES } from "http";
import { ok } from "assert";
import { randomUUID } from 'crypto'; // this is for unique file name, names should be very different 
import { runCircomPipeline } from "../services/circom_execution.ts" ;




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
    siblings.unshift(leaf_BigInt);
    adding_family(siblings);

    const root = prepareMerkleRootForCircom(siblings);
    console.log("Computed Merkle Root:", root);

    const obj = {
          client : root.root.toString()
        };

    const { proofPath, publicPath } = await runCircomPipeline(obj);

    
    

    res.status(200).json({
      success: true,
      siblingsCount: siblings.length,
      root_message: root.root.toString()
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,  //// 
    });
  }
};


