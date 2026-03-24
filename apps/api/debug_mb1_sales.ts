import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const mb1Id = 'e803051e-c9ca-46a4-9014-83075d6a3e13' // From previous logs
  
  console.log(`Checking all sales for channel MB1 (${mb1Id})...`)

  const sales = await prisma.sale.findMany({
    where: { 
      channelId: mb1Id
    },
    include: {
      channel: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  console.log('MB1_SALES_ALL:' + JSON.stringify(sales))
}

debug().catch(console.error).finally(() => prisma.$disconnect())
