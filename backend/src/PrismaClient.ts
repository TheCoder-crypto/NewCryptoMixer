import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg';


export function import_adapter() : PrismaPg  { 

    const connectionString = `${process.env.DATABASE_URL}`
    const adapter = new PrismaPg({ connectionString })
    return adapter;
}