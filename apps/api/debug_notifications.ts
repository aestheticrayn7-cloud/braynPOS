import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function debug() {
  const notes = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  })
  
  fs.writeFileSync('notifications.txt', JSON.stringify(notes, null, 2))
}

debug().finally(() => prisma.$disconnect())
