import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function list() {
  const tables = await prisma.$queryRaw<any[]>`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `
  fs.writeFileSync('tables_list.txt', JSON.stringify(tables, null, 2))
}

list().finally(() => prisma.$disconnect())
