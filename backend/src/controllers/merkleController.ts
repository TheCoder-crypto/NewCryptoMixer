import type { Request, Response } from "express";
import { prepareMerkleRootForCircom } from "../zk_circuit/zkcircuit2.ts";
import { generateRandomSiblings } from "../services/newSiblings.ts";
import { adding_family } from "../services/creating_family.ts"
import * as fs from 'fs';
import { STATUS_CODES } from "http";
import { ok } from "assert";
import { randomUUID } from 'crypto'; // this is for unique file name, names should be very different 
import { runCircomPipeline } from "../services/circom_execution.ts" ;
import { PrismaClient } from "../generated/prisma/client.ts";
import { import_adapter } from "../PrismaClient.ts";
import { sha256, toUtf8Bytes } from "ethers";
import type { ExecOptions } from "child_process";






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

    const rootString = root.root.toString();
    const bytes = toUtf8Bytes(rootString);
    const nullifier = sha256(bytes);

    
    const adapter = import_adapter();
    const prisma = new PrismaClient({ adapter });

    await prisma.nullifiers.create({
      data: {
        null_hash: nullifier
      }
    });

    /// const { proofPath, publicPath } = await runCircomPipeline(obj);


    res.status(200).json({
      success: true,
      siblingsCount: siblings.length,
      root_message: root.root.toString(),
      nullifier: nullifier
    });

 
      

} catch (e: unknown) {
  console.error("Error in getLeaf:", e);
  res.status(500).json({
    success: false,
    message: "Error processing leaf",
  
  });
}
};





      
  
    



    
 

