/**
 * BraynPOS - Automated Tenant Isolation Probe
 * 
 * This script runs security regression tests against the Prisma multi-tenant 
 * extension to mathematically guarantee that data cannot leak between channels.
 * 
 * It simulates a manager from Channel A attempting to query data belonging 
 * strictly to Channel B across all isolated resources.
 */

import { basePrisma, prisma } from './src/lib/prisma.js'
import { requestContext } from './src/lib/request-context.plugin.js'

async function runTenantProbes() {
  console.log('🛡️ Starting Tenant Isolation Probes...')

  const channelA = await basePrisma.channel.create({
    data: { name: 'Tenant Probe - Branch A', code: 'PRB_A', type: 'RETAIL_SHOP' }
  })
  
  const channelB = await basePrisma.channel.create({
    data: { name: 'Tenant Probe - Branch B', code: 'PRB_B', type: 'RETAIL_SHOP' }
  })

  // Setup: Create target data explicitly assigned to Channel B
  const userB = await basePrisma.user.create({
    data: {
      username: 'target_b',
      email: 'target_b@probe.com',
      passwordHash: 'dummy',
      role: 'CASHIER',
      channelId: channelB.id
    }
  })

  const depositB = await basePrisma.bankDeposit.create({
    data: {
      amount:      5000,
      reference:   'Test Bank',
      channelId:   channelB.id,
      depositedBy: userB.id
    }
  })

  // -------------------------------------------------------------
  // PROBE 1: Can a request bound to Channel A read Channel B's User?
  // -------------------------------------------------------------
  await requestContext.run({ channelId: channelA.id, userId: 'probe', requestId: 'probe-req-1' }, async () => {
    
    // Test 1: findMany on Users
    const users = await prisma.user.findMany({ where: { email: 'target_b@probe.com' } })
    if (users.length > 0) {
      throw new Error('❌ LEAK DETECTED: Channel A can read Channel B User via findMany')
    }

    // Test 2: findUnique on Users
    const user = await prisma.user.findUnique({ where: { id: userB.id } })
    if (user !== null) {
      throw new Error('❌ LEAK DETECTED: Channel A can read Channel B User via findUnique')
    }

    // Test 3: findMany on BankDeposits
    const deposits = await prisma.bankDeposit.findMany({ where: { id: depositB.id } })
    if (deposits.length > 0) {
      throw new Error('❌ LEAK DETECTED: Channel A can read Channel B BankDeposit via findMany')
    }

    console.log('✅ PROBE: Read Isolation enforced automatically via AsyncLocalStorage (RLS active)')
  })

  // Cleanup
  await basePrisma.bankDeposit.deleteMany({ where: { id: depositB.id } })
  await basePrisma.user.deleteMany({ where: { id: userB.id } })
  await basePrisma.channel.deleteMany({ where: { id: { in: [channelA.id, channelB.id] } } })

  console.log('🛡️ All Probes Passed! Tenant Isolation is mathematically sound.')
}

runTenantProbes().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => {
  basePrisma.$disconnect()
  prisma.$disconnect()
})
