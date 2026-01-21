import type { Request, Response } from "express";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { randomBytes } from "crypto";

export function RandomLeafTesting(): bigint { 
    const randomMsg = randomBytes(32);
    const randomHash = keccak_256(randomMsg);
    const HashBigInt = BigInt("0x" + Buffer.from(randomHash).toString("hex"));
    return HashBigInt;
}


export async function sendJsonRequest(req: Request, res: Response) {
  try {
    const obj = {
      leaf: RandomLeafTesting().toString()
    };

  const response = await fetch("http://localhost:3000/merkle", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    return res.status(200).json({
      triggered: true,
      merkleResponse: data,
    });
  } catch (err) {
    console.error("Error sending JSON request:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}



