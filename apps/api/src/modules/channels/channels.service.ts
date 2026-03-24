// ══════════════════════════════════════════════════════════════════════
// FILE: apps/api/src/modules/channels/channels.service.ts
// Fixes:
//   1. findAll — was passing {} for both includeDeleted=true and false,
//      meaning soft-deleted channels were always visible. Now explicitly
//      filters deletedAt: null when includeDeleted is false.
//   2. create — the __includeDeleted: true hack passed to prisma.channel
//      .findFirst is not a real Prisma field. If the soft-delete middleware
//      doesn't intercept it, the deleted-channel lookup silently returns
//      null and the descriptive "restore it" error message never fires.
//      Replaced with a raw $queryRaw that bypasses the middleware entirely.
//   3. restore — same __includeDeleted hack on the update where clause.
//      Prisma will throw P2025 (record not found) on a soft-deleted record
//      because the soft-delete middleware adds deletedAt: null to all
//      findUnique/update queries. Fixed with a two-step: verify existence
//      via $queryRaw then update.
//   4. P2002 handler now covers name conflicts as well as code conflicts
//      since the schema has @@unique([channelId, name]) on Channel.
// ══════════════════════════════════════════════════════════════════════

import { prisma } from '../../lib/prisma.js'
import type { Prisma } from '@prisma/client'

export class ChannelsService {
  async findAll(includeDeleted = false, channelId?: string) {
    return prisma.channel.findMany({
      where: {
        ...(includeDeleted ? {} : { deletedAt: null }),
        // If a specific channelId is provided, return only that channel
        // (used when non-admin users request the channel list)
        ...(channelId ? { id: channelId } : {}),
      },
      orderBy: { name: 'asc' },
    })
  }

  async findById(id: string) {
    return prisma.channel.findUniqueOrThrow({
      where: { id },
      include: {
        _count: { select: { users: true, sales: true } },
      },
    })
  }

  async create(data: Prisma.ChannelCreateInput) {
    try {
      return await prisma.channel.create({ data })
    } catch (err: any) {
      if (err.code === 'P2002') {
        const fields: string[] = err.meta?.target || []
        const isCodeConflict = fields.includes('code')
        const isNameConflict = fields.includes('name')

        // FIX 2: Use $queryRaw to look up soft-deleted channels without
        // the soft-delete middleware blocking the query.
        if (isCodeConflict) {
          const existing = await prisma.$queryRaw<Array<{ id: string; deletedAt: Date | null }>>`
            SELECT id, "deletedAt" FROM channels WHERE code = ${data.code as string} LIMIT 1
          `
          if (existing[0]?.deletedAt) {
            const error = new Error(
              `Conflict: A channel with code "${data.code}" was previously deleted. ` +
              `Restore it using the restore endpoint or choose a different code.`
            ) as any
            error.statusCode = 409
            throw error
          }
        }

        // FIX 4: Handle name uniqueness conflict (@@unique([channelId, name]))
        const fieldLabel = isNameConflict ? 'name' : isCodeConflict ? 'code' : fields.join(', ')
        const error = new Error(`Conflict: A channel with this ${fieldLabel} already exists.`) as any
        error.statusCode = 409
        throw error
      }
      throw err
    }
  }

  async update(id: string, data: Prisma.ChannelUpdateInput) {
    return prisma.channel.update({ where: { id }, data })
  }

  async softDelete(id: string) {
    // Confirm the channel exists and is not already deleted before proceeding
    const existing = await prisma.$queryRaw<Array<{ id: string; deletedAt: Date | null }>>`
      SELECT id, "deletedAt" FROM channels WHERE id = ${id} LIMIT 1
    `
    if (!existing[0]) {
      const error = new Error(`Channel not found`) as any
      error.statusCode = 404
      throw error
    }
    if (existing[0].deletedAt !== null) {
      const error = new Error(`Channel is already deleted`) as any
      error.statusCode = 409
      throw error
    }

    return prisma.channel.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  async restore(id: string) {
    // FIX 3: The original code passed __includeDeleted: true into the
    // Prisma where clause — not a real field. The soft-delete middleware
    // appends deletedAt: null to all update queries, so Prisma throws
    // P2025 (not found) on any soft-deleted record.
    // Solution: verify existence via raw SQL first, then update directly.
    const existing = await prisma.$queryRaw<Array<{ id: string; deletedAt: Date | null }>>`
      SELECT id, "deletedAt" FROM channels WHERE id = ${id} LIMIT 1
    `
    if (!existing[0]) {
      const error = new Error(`Channel not found`) as any
      error.statusCode = 404
      throw error
    }
    if (existing[0].deletedAt === null) {
      const error = new Error(`Channel is not deleted — nothing to restore`) as any
      error.statusCode = 409
      throw error
    }

    // Bypass the soft-delete middleware using $executeRaw for the restore
    await prisma.$executeRaw`
      UPDATE channels SET "deletedAt" = NULL, "updatedAt" = NOW() WHERE id = ${id}
    `

    // Return the restored channel
    return prisma.$queryRaw<Array<Record<string, unknown>>>`
      SELECT * FROM channels WHERE id = ${id} LIMIT 1
    `.then(rows => rows[0])
  }
}

export const channelsService = new ChannelsService()
