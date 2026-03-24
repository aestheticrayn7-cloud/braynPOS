import { PrismaClient } from '@prisma/client'
import fs from 'fs'
const prisma = new PrismaClient()

async function main() {
  const transfers = await prisma.transfer.findMany({ take: 5 })
  const serials = await prisma.serial.findMany({ take: 3 })
  const users = await prisma.user.findMany({ take: 3 })
  
  const out = {
    transfers,
    serials,
    users
  }
  
  fs.writeFileSync('schema_audit.json', JSON.stringify(out, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
