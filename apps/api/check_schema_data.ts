import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const transfers = await prisma.transfer.findMany({ take: 5 })
  const serials = await prisma.serial.findMany({ take: 5 })
  const payments = await prisma.payment.findMany({ take: 5 })
  const tickets = await prisma.supportTicket.findMany({ take: 5 })
  
  console.log('TRANSFERS:', JSON.stringify(transfers, null, 2))
  console.log('SERIALS:', JSON.stringify(serials, null, 2))
  console.log('PAYMENTS:', JSON.stringify(payments, null, 2))
  console.log('TICKETS:', JSON.stringify(tickets, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
