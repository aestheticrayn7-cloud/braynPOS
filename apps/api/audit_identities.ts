import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const p1 = await prisma.purchase.findUnique({ where: { purchaseNo: 'PUR-1773854650948' } })
  const p2 = await prisma.purchase.findUnique({ where: { purchaseNo: 'PUR-1773854190903' } })
  
  console.log(`P1 (${p1?.purchaseNo}) Channel: ${p1?.channelId}`)
  console.log(`P2 (${p2?.purchaseNo}) Channel: ${p2?.channelId}`)
  
  // Check users
  const olivia = await prisma.user.findFirst({ where: { username: 'olivia' } })
  console.log(`Olivia Channel: ${olivia?.channelId}`)
  
  const amon = await prisma.user.findFirst({ where: { username: 'Amon' } })
  console.log(`Amon Channel: ${amon?.channelId}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
