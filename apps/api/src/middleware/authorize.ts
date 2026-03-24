import type { FastifyRequest, FastifyReply } from 'fastify'
import type { UserRole } from '@prisma/client'

export function authorize(...allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      reply.status(401).send({ error: 'Authentication required' })
      return
    }

    if (!allowedRoles.includes(request.user.role as UserRole)) {
      reply.status(403).send({
        error:         'Insufficient permissions',
        requiredRoles: allowedRoles,
        currentRole:   request.user.role,
      })
      return
    }
  }
}

// ── Role hierarchy for hasRole() comparisons ──────────────────────────
// FIX: ADMIN and MANAGER_ADMIN previously both scored 90, meaning
// hasRole(user, 'MANAGER_ADMIN') returned true for plain ADMIN users.
// ADMIN is a branch-level admin role; MANAGER_ADMIN has cross-channel
// authority. They are intentionally different trust levels.
//
// Hierarchy (higher = more trusted):
//   SUPER_ADMIN    100  — full system access, bypasses channel isolation
//   MANAGER_ADMIN   90  — cross-channel admin, approves finance/user ops
//   ADMIN           80  — branch admin, elevated over standard manager
//   MANAGER         70  — branch manager, approves day-to-day operations
//   CASHIER         40  — point-of-sale operations
//   SALES_PERSON    40  — sales operations (same level as cashier)
//   STOREKEEPER     30  — inventory operations
//   PROMOTER        20  — limited sales/view access
export const roleHierarchy: Record<string, number> = {
  SUPER_ADMIN:   100,
  MANAGER_ADMIN:  90,
  ADMIN:          80,  // FIX: was 90 — now correctly below MANAGER_ADMIN
  MANAGER:        70,  // FIX: was 80 — adjusted to preserve relative gaps
  CASHIER:        40,
  SALES_PERSON:   40,
  STOREKEEPER:    30,
  PROMOTER:       20,
}

export function hasRole(user: { role: string }, role: UserRole): boolean {
  return (roleHierarchy[user.role] ?? 0) >= (roleHierarchy[role] ?? 0)
}
