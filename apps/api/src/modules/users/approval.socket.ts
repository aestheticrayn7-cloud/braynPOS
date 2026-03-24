import { Server, Socket } from 'socket.io'
import { verifyToken } from '../../lib/jwt.js'
import { eventBus } from '../../lib/event-bus.js'
import pino from 'pino'

const logger = pino({ name: 'approval-socket' })

export function setupApprovalSocket(io: Server) {
  const approvalNamespace = io.of('/approvals')

  approvalNamespace.on('connection', (socket: Socket) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token

    if (!token) {
      socket.disconnect()
      return
    }

    try {
      const decoded = verifyToken(token as string)
      // Standardize on .id for internal use; many JWTs use .sub for the user ID
      const userId = decoded.id || decoded.sub
      
      if (!userId) {
        logger.error({ token: 'provided' }, 'Token verified but contains no user ID (id/sub)')
        socket.disconnect()
        return
      }

      socket.data.user = { ...decoded, id: userId }
      // Attach to socket root for raw compatibility if needed by emitters
      ;(socket as any).userId = userId
      
      // Join a room based on role or channel for targeted alerts
      if (decoded.role === 'SUPER_ADMIN' || decoded.role === 'MANAGER_ADMIN') {
        socket.join('admins')
      }
      if (decoded.channelId) {
        socket.join(`channel:${decoded.channelId}`)
      }
      
      logger.debug({ username: decoded.username, role: decoded.role }, 'Approval socket connected')
    } catch (err) {
      socket.disconnect()
      return
    }

    socket.on('disconnect', () => {
      logger.debug('Approval socket disconnected')
    })
  })

  // Listen to Domain Events and broadcast to relevant rooms
  eventBus.on('approval.requested', (data) => {
    logger.debug({ approvalId: data.approvalId }, '[ApprovalSocket] Broadcasting request')
    
    // Notify all admins
    approvalNamespace.to('admins').emit('new_approval_request', data)

    // Notify channel-scoped managers
    if (data.channelId) {
      approvalNamespace.to(`channel:${data.channelId}`).emit('new_approval_request', data)
    }
  })
}
