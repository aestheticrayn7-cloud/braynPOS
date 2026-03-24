import { PrismaClient } from '../apps/api/src/generated/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        category: true,
        channelItems: {
          include: { channel: true }
        }
      }
    })
    console.log('--- RECENT ITEMS ---')
    items.forEach(item => {
      console.log(`ID: ${item.id}`)
      console.log(`Name: ${item.name}`)
      console.log(`Status: ${item.isActive ? 'ACTIVE' : 'INACTIVE'}`)
      console.log(`Deleted: ${item.deletedAt ? 'YES' : 'NO'}`)
      console.log(`Channels: ${item.channelItems.map(ci => ci.channel.name).join(', ') || 'NONE'}`)
      console.log('-------------------')
    })
  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
