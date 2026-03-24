import { PrismaClient } from '@prisma/client'
import process from 'process'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Seeding EXTENDED test data...')

  // 1. Ensure HQ exists (from base seed)
  const hq = await prisma.channel.findUnique({ where: { code: 'HQ' } })
  if (!hq) throw new Error('HQ channel not found. Run base seed first.')

  // 2. Create 2 more channels
  const shopA = await prisma.channel.upsert({
    where: { code: 'SHOP-A' },
    create: { name: 'Retail Shop A', code: 'SHOP-A', type: 'RETAIL_SHOP' },
    update: {}
  })
  const wholesaleB = await prisma.channel.upsert({
    where: { code: 'WHOLESALE-B' },
    create: { name: 'Wholesale Depot B', code: 'WHOLESALE-B', type: 'WHOLESALE_SHOP' },
    update: {}
  })
  console.log('  ✓ Channels created: SHOP-A, WHOLESALE-B')

  // 3. Create 5 Users (including roles)
  const roles = ['ADMIN', 'MANAGER', 'CASHIER', 'STOREKEEPER', 'PROMOTER']
  const channels = [hq.id, shopA.id, wholesaleB.id]
  
  for (let i = 1; i <= 5; i++) {
    const username = `user${i}`
    await prisma.user.upsert({
      where: { id: `usr-test-${i}` },
      create: {
        id: `usr-test-${i}`,
        username,
        email: `${username}@brayn.app`,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$n4hWJT4ONk+cPNSRHSwwhPw$c6pjoMT0FEzXKxKBgFK5S0AKtW3VkkLScnjPPsA3KJI', // Admin@123
        role: roles[i-1] as any,
        channelId: channels[i % channels.length],
        isActive: true
      },
      update: {}
    })
    console.log(`  ✓ User created: ${username}`)
  }

  // 4. Create 30 Items
  const catElectronics = await prisma.category.upsert({
    where: { id: 'cat-electronics' },
    create: { id: 'cat-electronics', name: 'Electronics' },
    update: {}
  })
  const catGeneral = await prisma.category.upsert({
    where: { id: 'cat-general' },
    create: { id: 'cat-general', name: 'General Merchandise' },
    update: {}
  })

  for (let i = 1; i <= 30; i++) {
    const sku = `SKU-TEST-${i.toString().padStart(3, '0')}`
    const item = await prisma.item.upsert({
      where: { id: `item-test-${i}` },
      create: {
        id: `item-test-${i}`,
        sku,
        name: `Test Product ${i}`,
        categoryId: i % 2 === 0 ? catElectronics?.id : catGeneral.id,
        retailPrice: 100 * i,
        wholesalePrice: 80 * i,
        minRetailPrice: 70 * i,
        weightedAvgCost: 50 * i,
      },
      update: {}
    })
    
    // Initial Stock at HQ
    await prisma.inventory_balances.upsert({
      where: { itemId_channelId: { itemId: item.id, channelId: hq.id } },
      create: { itemId: item.id, channelId: hq.id, availableQty: 100 },
      update: { availableQty: 100 }
    })
  }
  console.log('  ✓ 30 Items and HQ stock seeded')

  // 5. Create 10 Transfers
  // We'll transfer from HQ to Shop A or Wholesale B
  const itemsList = await prisma.item.findMany({ take: 5, where: { id: { startsWith: 'item-test-' } } })
  
  for (let i = 1; i <= 10; i++) {
    const toChannel = i % 2 === 0 ? shopA.id : wholesaleB.id
    const transfer = await prisma.transfer.create({
      data: {
        transferNo: `TRF-${new Date().getTime()}-${i}`,
        fromChannelId: hq.id,
        toChannelId: toChannel,
        status: 'SENT',
        sentBy: 'admin', // Using the username or any valid string since it's just a string in schema
        sentAt: new Date(),
        notes: `Automated test transfer ${i}`,
        lines: {
          create: itemsList.map(item => ({
            itemId: item.id,
            sentQuantity: 5,
            receivedQuantity: 5
          }))
        }
      }
    })
    console.log(`  ✓ Transfer created: ${transfer.transferNo}`)
  }

  console.log('✅ Extended test data seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
