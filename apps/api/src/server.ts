import 'dotenv/config'
import { buildApp } from './app.js'
import { Server } from 'socket.io'
import { setupSupportSocket } from './modules/support/support.socket.js'
import { startProactiveMonitor } from './modules/support/proactive-monitor.js'
import { startCommissionListener } from './modules/commission/commission.listener.js'
import { startNotificationWorker }  from './workers/notification.worker.js'
import { basePrisma } from './lib/prisma.js'
import { redis } from './lib/redis.js'

const PORT = parseInt(process.env.PORT || process.env.API_PORT || '4000', 10)
const HOST = process.env.API_HOST || '0.0.0.0'

/**
 * 🛠️ Maintenance Hook: Admin Recovery
 * Allows resetting the super-admin password via environment variable if lockouts occur.
 */
async function syncAdmin() {
  const resetPass = process.env.ADMIN_PASSWORD_RESET
  if (!resetPass) return

  const { hashPassword } = await import('./lib/password.js')
  
  // Find or Create HQ Channel (Required for Super Admin)
  let hqChannel = await basePrisma.channel.findUnique({ where: { code: 'HQ' } })
  if (!hqChannel) {
    hqChannel = await basePrisma.channel.create({
      data: { name: 'Headquarters', code: 'HQ', type: 'WAREHOUSE' }
    })
  }

  const passwordHash = await hashPassword(resetPass)
  await basePrisma.user.upsert({
    where: { id: 'usr-super-admin' },
    create: {
      id: 'usr-super-admin',
      username: 'admin',
      email: 'admin@brayn.app',
      passwordHash,
      role: 'SUPER_ADMIN',
      channelId: hqChannel.id,
      status: 'ACTIVE',
    },
    update: {
      passwordHash,
      status: 'ACTIVE',
    },
  })
  
  console.log('✅ [MAINTENANCE] Admin user synced/reset successfully.')
}

async function start() {
  console.log('🚀 [BOOT] Starting BraynPOS API restoration sequence...')
  console.log('🔗 [BOOT] PORT:', PORT)
  console.log('🔗 [BOOT] HOST:', HOST)

  try {
    // Wrap syncAdmin in a race to prevent silent DB hangs
    console.log('⌚ [BOOT] Syncing Admin (Maintenance Hook)...')
    const syncPromise = syncAdmin()
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('TIMEOUT: Database connection stalled during syncAdmin')), 10000)
    )
    await Promise.race([syncPromise, timeoutPromise])
    console.log('✅ [BOOT] syncAdmin completed.')
  } catch (err: any) {
    console.warn(`⚠️ [BOOT] syncAdmin failed or timed out: ${err.message}. Continuing...`)
  }

  console.log('🏗️ [BOOT] Building Fastify app...')
  const app = await buildApp()
  console.log('✅ [BOOT] Fastify app built.')

  try {
    console.log('👂 [BOOT] Starting listener...')
    
    // Initialize Socket.io
    const io = new Server(app.server, {
      cors: {
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
        credentials: true
      }
    })
    
    setupSupportSocket(io)
    const { setupApprovalSocket } = await import('./modules/users/approval.socket.js')
    setupApprovalSocket(io)
    
    const { setupInventorySocket } = await import('./modules/inventory/inventory.socket.js')
    setupInventorySocket(io)

    startProactiveMonitor()
    startCommissionListener()  // Fixed: automate commission calc
    startNotificationWorker()  // Fixed: start background notifications
    
    app.log.info(`🚀 BRAYN API v2.0 running on http://${HOST}:${PORT}`)
    app.log.info(`🔌 Socket.io initialized on /support`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }

  // Graceful shutdown
  const signals = ['SIGINT', 'SIGTERM'] as const
  for (const signal of signals) {
    process.on(signal, async () => {
      app.log.info(`Received ${signal} — shutting down gracefully...`)
      await app.close()
      await basePrisma.$disconnect()
      await redis.quit()
      process.exit(0)
    })
  }
}

start()
 
