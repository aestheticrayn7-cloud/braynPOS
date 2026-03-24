import { prisma } from '../../lib/prisma.js'
import type { Prisma } from '@prisma/client'

export class AccountsService {
  // FIX 1 + 2: Recursive CTE — handles unlimited depth, filters inactive
  async getChartOfAccounts() {
    const rows = await prisma.$queryRaw<Array<{
      id:       string
      code:     string
      name:     string
      type:     string
      parentId: string | null
      isSystem: boolean
      isActive: boolean
      depth:    number
    }>>`
      WITH RECURSIVE account_tree AS (
        -- Base: top-level accounts (no parent)
        SELECT
          id, code, name, type, "parentId", "isSystem", "isActive",
          0 AS depth
        FROM accounts
        WHERE "parentId" IS NULL
          AND "isActive"  = true

        UNION ALL

        -- Recursive: children of active accounts
        SELECT
          a.id, a.code, a.name, a.type, a."parentId", a."isSystem", a."isActive",
          at.depth + 1
        FROM accounts a
        JOIN account_tree at ON at.id = a."parentId"
        WHERE a."isActive" = true
      )
      SELECT * FROM account_tree
      ORDER BY code
    `

    // Build the tree in JavaScript from the flat list
    const map = new Map<string, any>()
    const roots: any[] = []

    for (const row of rows) {
      map.set(row.id, { ...row, children: [] })
    }

    for (const row of rows) {
      const node = map.get(row.id)!
      if (row.parentId) {
        const parent = map.get(row.parentId)
        if (parent) parent.children.push(node)
      } else {
        roots.push(node)
      }
    }

    return roots
  }

  async findAll(channelId?: string) {
    return prisma.account.findMany({
      where: {
        isActive: true,
        ...(channelId ? { OR: [{ channelId }, { channelId: null }] } : {}),
      },
      orderBy: { code: 'asc' },
    })
  }

  async findById(id: string) {
    return prisma.account.findUniqueOrThrow({
      where:   { id },
      include: {
        parent:   { select: { id: true, code: true, name: true } },
        children: { select: { id: true, code: true, name: true } },
      },
    })
  }

  async create(data: {
    code:       string
    name:       string
    type:       'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'
    parentId?:  string
    channelId?: string
  }) {
    return prisma.account.create({
      data: {
        code:      data.code,
        name:      data.name,
        type:      data.type,
        parentId:  data.parentId  ?? null,
        channelId: data.channelId ?? null,
        isSystem:  false,
      },
    })
  }

  async update(id: string, data: { name?: string; isActive?: boolean }) {
    const account = await prisma.account.findUniqueOrThrow({ where: { id } })

    if (account.isSystem && data.name) {
      throw { statusCode: 400, message: 'System accounts cannot be renamed' }
    }
    if (account.isSystem && data.isActive === false) {
      throw { statusCode: 400, message: 'System accounts cannot be deactivated' }
    }

    return prisma.account.update({ where: { id }, data })
  }
}

export const accountsService = new AccountsService()
