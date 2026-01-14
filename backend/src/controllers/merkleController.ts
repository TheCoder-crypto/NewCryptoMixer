import { Request, Response } from "express";
import { generateRandomSiblings } from "../services/newSiblings.js";
import { Field, method, ZkProgram, SelfProof } from 'o1js';
import { MerkleRoot } from '../zk_circuit/zk_circuit.js';
import { METHODS } from "http";


export const getHome = (req: Request, res: Response) => {
  res.send("Hello from My Privacy Mixer:");
};

export const getLeaf = async (req: Request, res: Response) => {     ///// this is the function that is supposed to input the leaf inside the circuit (and the siblings as well)
  try {
    const { leaf } = req.body;     //// looks for leaf

    if (!leaf) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: leaf",
      });
    }

    // For now just return it, you can plug in your logic next
    res.status(200).json({
      success: true,
      leafReceived: leaf
    });


  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



  

