import { Server, Socket } from 'socket.io'
import { verify } from 'jsonwebtoken'
import { eventBus } from '../../lib/event-bus.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function setupInventorySocket(io: Server) {
  const inventoryNamespace = io.of('/inventory')

  inventoryNamespace.on('connection', (socket: Socket) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token

    if (!token) {
      socket.disconnect()
      return
    }

    try {
      const decoded = verify(token as string, JWT_SECRET) as any
      socket.data.user = decoded
      
      // Join channel-specific room
      if (decoded.channelId) {
        socket.join(`channel:${decoded.channelId}`)
      }
    } catch {
      socket.disconnect()
      return
    }

    socket.on('disconnect', () => { })
  })

  // Listen to internal event bus for stock changes
  eventBus.on('inventory.updated', (payload: {
    itemId: string
    channelId: string
    availableQty: number
    movementType: string
  }) => {
    // Broadcast to the specific channel room
    inventoryNamespace.to(`channel:${payload.channelId}`).emit('stock_update', {
      itemId:       payload.itemId,
      availableQty: payload.availableQty,
      movementType: payload.movementType
    })

    // Also broadcast to global admins room if we have one (optional)
    inventoryNamespace.to('channel:HQ').emit('stock_update', payload)
  })
}
