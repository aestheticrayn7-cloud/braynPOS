import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const evans = await prisma.user.findFirst({
    where: { username: { contains: 'evans', mode: 'insensitive' } }
  })
  
  if (!evans) {
    console.log('Evans not found.')
    return
  }

  console.log(`Checking all sales for Evans (${evans.id})...`)

  const sales = await prisma.sale.findMany({
    where: { 
      performedBy: evans.id
    },
    include: {
      channel: { select: { name: true, code: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  console.log('EVANS_SALES_ALL:' + JSON.stringify(sales))
}

debug().catch(console.error).finally(() => prisma.$disconnect())
