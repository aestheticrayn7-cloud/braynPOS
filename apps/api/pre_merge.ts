import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8f39-dcd8dd493de2'
  
  console.log('--- PRE-CONSOLIDATION MERGE ---')

  await prisma.$transaction(async (tx) => {
    // 1. Merge Brands
    const allBrands = await tx.brand.findMany()
    const hqBrands = allBrands.filter(b => b.channelId === hqId)
    const otherBrands = allBrands.filter(b => b.channelId !== hqId)
    
    for (const b of otherBrands) {
       const match = hqBrands.find(hb => hb.name.toLowerCase() === b.name.toLowerCase())
       if (match) {
          console.log(`Merging Brand "${b.name}" -> HQ Brand "${match.name}"`)
          await tx.item.updateMany({ where: { brandId: b.id }, data: { brandId: match.id } })
          await tx.brand.delete({ where: { id: b.id } })
       } else {
          // No match, just move it to HQ
          console.log(`Moving Brand "${b.name}" to HQ`)
          await tx.brand.update({ where: { id: b.id }, data: { channelId: hqId } })
       }
    }

    // 2. Merge Categories
    const allCats = await tx.category.findMany()
    const hqCats = allCats.filter(c => c.channelId === hqId)
    const otherCats = allCats.filter(c => c.channelId !== hqId)
    
    for (const c of otherCats) {
       const match = hqCats.find(hc => hc.name.toLowerCase() === c.name.toLowerCase())
       if (match) {
          console.log(`Merging Category "${c.name}" -> HQ Category "${match.name}"`)
          await tx.item.updateMany({ where: { categoryId: c.id }, data: { categoryId: match.id } })
          await tx.category.delete({ where: { id: c.id } })
       } else {
          console.log(`Moving Category "${c.name}" to HQ`)
          await tx.category.update({ where: { id: c.id }, data: { channelId: hqId } })
       }
    }

    // 3. Merge Suppliers
    const allSups = await tx.supplier.findMany()
    const hqSups = allSups.filter(s => s.channelId === hqId)
    const otherSups = allSups.filter(s => s.channelId !== hqId)
    
    for (const s of otherSups) {
       const match = hqSups.find(hs => hs.name.toLowerCase() === s.name.toLowerCase())
       if (match) {
          console.log(`Merging Supplier "${s.name}" -> HQ Supplier "${match.name}"`)
          await tx.item.updateMany({ where: { supplierId: s.id }, data: { supplierId: match.id } })
          await tx.purchase.updateMany({ where: { supplierId: s.id }, data: { supplierId: match.id } })
          await tx.purchaseOrder.updateMany({ where: { supplierId: s.id }, data: { supplierId: match.id } })
          await tx.supplier.delete({ where: { id: s.id } })
       } else {
          console.log(`Moving Supplier "${s.name}" to HQ`)
          await tx.supplier.update({ where: { id: s.id }, data: { channelId: hqId } })
       }
    }
  })

  console.log('✅ PRE-MERGE COMPLETE.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
