
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const tickets = await prisma.supportTicket.findMany({
    include: {
      _count: { select: { messages: true } },
      messages: { select: { sender: true, content: true } }
    }
  })
  console.log(JSON.stringify(tickets, null, 2))
}

main().finally(() => prisma.$disconnect())
