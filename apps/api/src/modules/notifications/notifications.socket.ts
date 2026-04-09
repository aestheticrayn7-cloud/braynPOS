import { Server, Socket } from 'socket.io'
import { verifyToken } from '../../lib/jwt.js'
import { setNotificationIo } from './notifications.service.js'

/**
 * Notifications Socket: Handles room management for real-time alerts.
 * Users join rooms based on their channelId and role.
 */
export function setupNotificationSocket(io: Server) {
  // Share the IO instance with the service for dispatching
  setNotificationIo(io)

  io.on('connection', (socket: Socket) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token

    if (!token) return

    try {
      const user = verifyToken(token as string) as any
      socket.data.user = user

      // Join Channel Room: Receives alerts for their specific branch (Low Stock, Transfers)
      if (user.channelId) {
        socket.join(`channel:${user.channelId}`)
      }

      // Join Admin/SuperAdmin Room: Receives system-wide alerts
      if (['SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN'].includes(user.role)) {
        socket.join('super-admins')
        if (user.channelId) {
            socket.join(`admin:${user.channelId}`)
        }
      }

    } catch {
      // Ignore invalid tokens for notifications — socket stays connected or disconnects gracefully
    }

    socket.on('disconnect', () => {
      // Cleanup happens automatically in Socket.io
    })
  })
}
