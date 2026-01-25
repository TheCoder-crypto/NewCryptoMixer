// circomPipeline.ts
import * as fs from "fs";
import { spawn } from "child_process";
import { randomUUID } from "crypto";
import path from "path";

interface CircomPipelineResult {
  proofPath: string;
  publicPath: string;
}

function runCommand(command: string, args: string[], cwd?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { cwd, shell: true });

    proc.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    proc.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}


export async function runCircomPipeline(inputObj: any): Promise<CircomPipelineResult> {
  const id = randomUUID();

  const circomBuildDir = "C:\\Users\\bogda\\blockchain_projects\\backend\\src\\circom_circuit\\build\\Circuit_js";

  const inputPath = path.join(circomBuildDir, `input_${id}.json`);
  const witnessPath = path.join(circomBuildDir, `witness_${id}.wtns`);
  const proofPath = path.join(circomBuildDir, `proof_${id}.json`);
  const publicPath = path.join(circomBuildDir, `public_${id}.json`);

  //  Save input JSON
  fs.writeFileSync(inputPath, JSON.stringify(inputObj, null, 2), "utf-8");
  console.log("Saved input JSON:", inputPath);

  //  Generate witness
  await runCommand(
    "node",
    ["generate_witness.js", "Circuit.wasm", path.basename(inputPath), path.basename(witnessPath)],
    circomBuildDir
  );

  //  Generate proof
  await runCommand(
    "snarkjs",
    ["groth16", "prove", "Circuit_0001.zkey", path.basename(witnessPath), path.basename(proofPath), path.basename(publicPath)],
    circomBuildDir
  );

  //  Return proof paths
  return { proofPath, publicPath };
}
