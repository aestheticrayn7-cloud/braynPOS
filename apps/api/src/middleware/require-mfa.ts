import type { FastifyRequest, FastifyReply } from 'fastify'

/**
 * Middleware that enforces MFA verification for sensitive operations.
 * The JWT token must include mfaVerified: true after TOTP verification.
 */
export async function requireMfa(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.user) {
    reply.status(401).send({ error: 'Authentication required' })
    return
  }

  // If user has MFA enabled, token must include mfaVerified flag
  if (request.user.mfaVerified !== true) {
    reply.status(403).send({
      error: 'MFA verification required for this operation',
      code: 'MFA_REQUIRED',
    })
    return
  }
}
