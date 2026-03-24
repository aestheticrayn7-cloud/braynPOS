import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const items = await prisma.item.findMany({ select: { id: true, name: true } })
  console.log(`Checking ${items.length} items...`)
  for (const item of items) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id)
    if (!isUuid) {
      console.log(`INVALID ID: [${item.id}] for item [${item.name}] (length: ${item.id.length})`)
    }
  }
  console.log('Done.')
}
main().catch(console.error).finally(() => prisma.$disconnect())
