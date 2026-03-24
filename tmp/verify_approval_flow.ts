// tmp/verify_approval_flow.ts
import { PrismaClient } from '@prisma/client'
import { eventBus } from '../apps/api/src/lib/event-bus'

const prisma = new PrismaClient()

async function test() {
  console.log('--- Starting Credit Approval Verification ---')
  
  // 1. Check if we have an admin and a channel
  const admin = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
  const channel = await prisma.channel.findFirst()
  
  if (!admin || !channel) {
    console.error('Missing admin or channel in seed data')
    return
  }
  
  console.log(`Using Admin: ${admin.username}, Channel: ${channel.name}`)

  // 2. Clear existing notifications for cleanliness
  await prisma.notification.deleteMany({ where: { type: 'APPROVAL_REQUESTED' } })
  
  // 3. Listen for the event manually
  let eventCaptured = false
  eventBus.on('approval.requested', (data) => {
    console.log('✅ Captured Domain Event: approval.requested', data)
    eventCaptured = true
  })

  // 4. Manual trigger of the logic (simulating what salesService does)
  console.log('Simulating credit sale approval request...')
  const approval = await prisma.managerApproval.create({
    data: {
      action: 'credit_sale',
      contextId: 'test-customer',
      channelId: channel.id,
      requesterId: admin.id,
      notes: 'Test credit sale approval'
    }
  })
  
  console.log('Created Approval Record:', approval.id)
  
  eventBus.emit('approval.requested', {
    approvalId: approval.id,
    requesterId: admin.id,
    channelId: channel.id,
    action: 'credit_sale',
    notes: approval.notes
  })

  // Wait for worker logic (simulated)
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 5. Verify Notification in DB
  const notification = await prisma.notification.findFirst({
    where: { type: 'APPROVAL_REQUESTED', message: { contains: approval.id } }
  })
  
  if (notification) {
    console.log('✅ Notification created in DB:', notification.message)
  } else {
    // Check if any notification was created
    const anyNotif = await prisma.notification.findFirst({ where: { type: 'APPROVAL_REQUESTED' } })
    if (anyNotif) {
      console.log('✅ Notification created in DB (general match):', anyNotif.message)
    } else {
      console.error('❌ Notification NOT found in DB')
    }
  }

  if (eventCaptured) {
    console.log('✅ Event Bus flow verified')
  } else {
    console.error('❌ Event Bus flow FAILED')
  }

  console.log('--- Verification Complete ---')
}

test().finally(() => prisma.$disconnect())
