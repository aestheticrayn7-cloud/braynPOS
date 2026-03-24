import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- CHANNEL STATUS CHECK ---')
  const channels = await (prisma as any).channel.findMany({
    where: { __includeDeleted: true }
  })
  console.log(`Found ${channels.length} channels total.`)
  for (const c of channels) {
    console.log(`- ID: ${c.id}, Name: ${c.name}, DeletedAt: ${c.deletedAt}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
