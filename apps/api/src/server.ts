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
      data: { name: 'Headquarters', code: 'HQ', status: 'ACTIVE' }
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
  await syncAdmin()
  const app = await buildApp()

  try {
    await app.listen({ port: PORT, host: HOST })
    
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
 
