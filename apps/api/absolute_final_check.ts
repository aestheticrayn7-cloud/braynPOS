import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const olivia = await prisma.user.findFirst({ where: { username: 'olivia' } })
  const hqId = olivia?.channelId
  console.log(`Olivia is now in Channel: ${hqId}`)
  
  const balances = await (prisma as any).inventory_balances.findMany({
    where: { channelId: hqId },
    include: { item: true }
  })
  
  console.log(`--- FINAL STOCK FOR OLIVIA ---`)
  balances.forEach((b: any) => {
    if (b.item.name.toLowerCase().includes('micro')) {
       console.log(`- ${b.item.name}: ${b.availableQty}`)
    }
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
