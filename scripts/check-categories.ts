import { PrismaClient } from '../apps/api/src/generated/client'

const prisma = new PrismaClient()

async function main() {
  const cats = await prisma.category.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, parentId: true }
  })
  console.log('--- Categories in DB ---')
  cats.forEach(c => {
    console.log(`ID: ${c.id} | Name: "${c.name}" | ParentID: ${c.parentId}`)
  })
  console.log('------------------------')
}

main().catch(console.error).finally(() => prisma.$disconnect())
