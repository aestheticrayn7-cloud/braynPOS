import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkRecentItemsRaw() {
  try {
    const items = await prisma.$queryRaw`SELECT * FROM items ORDER BY "createdAt" DESC LIMIT 10`
    console.log('--- RECENT ITEMS (RAW SQL) ---')
    console.log(JSON.stringify(items, null, 2))
  } catch (err) {
    console.error('Raw SQL Error:', err)
  }
}

checkRecentItemsRaw().finally(() => prisma.$disconnect())
