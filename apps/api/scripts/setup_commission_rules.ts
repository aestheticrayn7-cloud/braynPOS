import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- COMMISSION RULES SETUP ---')

  // 1. Verify Channels
  const channels = await prisma.channel.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true }
  })
  
  console.log('Current Channels:', JSON.stringify(channels, null, 2))

  const hq     = channels.find(c => c.name.toLowerCase().includes('headquarters'))?.id || '605831cd-dc31-47c1-8f39-dcd8dd493de2'
  const chuka  = channels.find(c => c.name.toLowerCase().includes('chuka'))?.id        || '72e6eb96-ab84-4ae0-9277-fdd6b42bde19'
  const mobile = channels.find(c => c.name.toLowerCase().includes('mobile'))?.id       || '43ae836a-7161-491f-b8ce-1c3c8de1ad0d'

  console.log(`Using IDs: HQ(${hq}), Chuka(${chuka}), Mobile(${mobile})`)

  // 2. Clean existing auto/default rules
  await prisma.$executeRaw`DELETE FROM commission_rules WHERE name LIKE 'Auto-%' OR name LIKE 'Default%'`

  const roles = ['CASHIER', 'SALES_PERSON', 'MANAGER', 'STOREKEEPER']
  const promoter = 'PROMOTER'

  const setupChannel = async (channelId: string, prefix: string, baseRate: number, promoterRate: number) => {
    for (const role of roles) {
      await prisma.commissionRule.upsert({
        where: { name: `${prefix} — ${role} Commission` },
        update: { channelId, role, ratePercent: baseRate, isActive: true },
        create: { 
          name: `${prefix} — ${role} Commission`, 
          channelId, 
          role, 
          ratePercent: baseRate, 
          appliesTo: {}, 
          isActive: true 
        }
      })
    }
    await prisma.commissionRule.upsert({
      where: { name: `${prefix} — ${promoter} Commission` },
      update: { channelId, role: promoter, ratePercent: promoterRate, isActive: true },
      create: { 
        name: `${prefix} — ${promoter} Commission`, 
        channelId, 
        role: promoter, 
        ratePercent: promoterRate, 
        appliesTo: {}, 
        isActive: true 
      }
    })
  }

  await setupChannel(hq, 'HQ', 12, 15)
  await setupChannel(chuka, 'CS', 12, 15)
  await setupChannel(mobile, 'MB', 8, 15)

  console.log('--- VERIFYING RULES ---')
  const rules = await prisma.commissionRule.findMany({
    where: { isActive: true },
    select: { name: true, channel: { select: { name: true } }, role: true, ratePercent: true }
  })
  console.log(JSON.stringify(rules, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
