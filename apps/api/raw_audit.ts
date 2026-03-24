import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- RAW DATABASE AUDIT ---')
  
  // 1. Raw Channels
  const chRes = await prisma.$queryRawUnsafe('SELECT id, name, "deletedAt" FROM channels')
  console.log('Channels Raw:', JSON.stringify(chRes, null, 2))

  // 2. Raw Sales Today
  const sRes = await prisma.$queryRawUnsafe('SELECT id, "receiptNo", "channelId", "createdAt", "deletedAt" FROM sales ORDER BY "createdAt" DESC LIMIT 5')
  console.log('Sales Raw (latest 5):', JSON.stringify(sRes, null, 2))

  // 3. User Evans Raw
  const uRes = await prisma.$queryRawUnsafe('SELECT id, username, role, "channelId" FROM users WHERE username ILIKE \'%evans%\'')
  console.log('User Evans Raw:', JSON.stringify(uRes, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
