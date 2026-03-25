import 'module-alias/register'
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

async function start() {
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
 
