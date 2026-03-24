import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const items = await prisma.item.findMany({ take: 5, select: { id: true, name: true, sku: true } })
  console.log(JSON.stringify(items, null, 2))
}
main().catch(console.error).finally(() => prisma.$disconnect())
