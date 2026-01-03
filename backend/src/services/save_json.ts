import fs from "fs-extra";


export async function saveMerkleToFile(leafHex: string, siblingsHex: string[]) {
    const filename = `merkle_${leafHex}.json`;
    const data = { leaf: leafHex, siblings: siblingsHex };

    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    return filename;
}
