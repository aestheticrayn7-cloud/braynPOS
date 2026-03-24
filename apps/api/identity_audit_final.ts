import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqs = await prisma.$queryRaw`SELECT * FROM channels WHERE name = 'Headquarters'`
  console.log('--- HQ DATABASE AUDIT ---')
  console.log(JSON.stringify(hqs, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2))
  
  const users = await prisma.$queryRaw`SELECT id, username, "channelId" FROM users`
  console.log('--- USER ASSIGNMENTS ---')
  console.log(JSON.stringify(users, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
