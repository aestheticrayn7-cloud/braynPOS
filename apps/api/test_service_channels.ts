import { channelsService } from './src/modules/channels/channels.service'
import { prisma } from './src/lib/prisma'

async function main() {
  const channels = await channelsService.findAll()
  console.log('--- CHANNELS SERVICE FINDALL ---')
  console.log(`Found ${channels.length} channels`)
  channels.forEach((c: any) => console.log(`- ${c.name} (${c.id}), Code: ${c.code}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
