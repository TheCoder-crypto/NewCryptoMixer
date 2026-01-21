import { PrismaClient } from "../generated/prisma/client.ts";
import { import_adapter } from "../PrismaClient.ts";

export async function adding_family(arr: bigint[]): Promise<void> {

    const adapter = import_adapter();
    const prisma = new PrismaClient({ adapter });

    for (let i = 0; i < arr.length; i += 8) {
        const chunk = arr.slice(i, i + 8);
      

        if (chunk.length < 8) {
            console.warn("Incomplete family, Aborted records", chunk);
        } else {
            const [leaf, sibling1, sibling2, sibling3, sibling4, sibling5, sibling6, sibling7] = chunk as [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];

            await prisma.family.create({
                data: {
                    leaf: leaf,
                    sibling1: sibling1,
                    sibling2: sibling2,
                    sibling3: sibling3,
                    sibling4: sibling4,
                    sibling5: sibling5,
                    sibling6: sibling6,
                    sibling7: sibling7
                },
            });
        }
    }

    console.log("All family records inserted!");
}



    





    
