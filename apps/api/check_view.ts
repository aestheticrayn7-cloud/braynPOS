import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  try {
    const res = await prisma.$queryRawUnsafe("SELECT pg_get_viewdef('stock_levels', true)")
    console.log('STOCK_LEVELS VIEW DEF:', JSON.stringify(res, null, 2))
  } catch (err) {
    console.log('stock_levels view might not exist or: ', (err as Error).message)
  }
}

check().finally(() => prisma.$disconnect())
