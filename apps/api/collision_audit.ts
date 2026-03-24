import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8f39-dcd8dd493de2'
  
  // 1. Check Brands
  const brands = await prisma.itemBrand.findMany({ where: { name: 'HP' } })
  console.log('--- HP BRANDS ---')
  console.log(JSON.stringify(brands, null, 2))
  
  // 2. Check Categories
  const cats = await prisma.itemCategory.findMany({ where: { name: 'HP' } })
  console.log('--- HP CATEGORIES ---')
  console.log(JSON.stringify(cats, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
