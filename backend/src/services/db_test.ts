import { PrismaClient } from "../generated/prisma/client.ts";
import { import_adapter } from "../PrismaClient.ts";

const adapter = import_adapter();
const prisma = new PrismaClient({ adapter });

async function getAllNullifiers() {
  const records = await prisma.nullifiers.findMany({
    select: {
      null_hash: true, // only this field
    },
  });

  if (records.length > 0) {
    console.log("All null_hash values:", records.map(r => r.null_hash));
  } else {
    console.log("No records found");
  }
}

getAllNullifiers();
