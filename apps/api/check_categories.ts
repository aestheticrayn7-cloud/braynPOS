import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkCategories() {
  console.log('--- ALL CATEGORIES ---')
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, channelId: true }
  })
  console.log(JSON.stringify(categories, null, 2))
}

checkCategories().finally(() => prisma.$disconnect())
