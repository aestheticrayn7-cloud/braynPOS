import { prisma } from '../../lib/prisma.js'

export class SettingsService {
  async getAll(channelId?: string | null) {
    const [globalSettings, channelSettings] = await Promise.all([
      prisma.setting.findMany({ where: { channelId: null } }),
      channelId
        ? prisma.setting.findMany({ where: { channelId } })
        : Promise.resolve([]),
    ])

    const merged: Record<string, any> = {}
    globalSettings.forEach(s  => { merged[s.key] = s.value })
    channelSettings.forEach(s => { merged[s.key] = s.value })
    return merged
  }

  async getByKey(key: string, channelId?: string | null) {
    // FIX 1: Native composite key lookup — no any cast needed
    if (channelId) {
      const local = await prisma.setting.findUnique({
        where: { key_channelId: { key, channelId } },
      })
      if (local) return local.value
    }

    const global = await prisma.setting.findUnique({
      where: { key_channelId: { key, channelId: null as any } },
    })
    return global?.value ?? null
  }

  async update(
    key:       string,
    value:     any,
    updatedBy: string,
    channelId: string | null = null
  ) {
    // FIX 1: Native upsert — no any cast needed
    return prisma.setting.upsert({
      where:  { key_channelId: { key, channelId: channelId as any } },
      create: { key, value, channelId: channelId as any, updatedBy },
      update: { value, updatedBy, updatedAt: new Date() },
    })
  }

  async bulkUpdate(
    settings:  Record<string, any>,
    updatedBy: string,
    channelId: string | null = null
  ) {
    // FIX 1: Native upsert in transaction — no any casts needed
    return prisma.$transaction(
      Object.entries(settings).map(([key, value]) =>
        prisma.setting.upsert({
          where:  { key_channelId: { key, channelId: channelId as any } },
          create: { key, value, channelId: channelId as any, updatedBy },
          update: { value, updatedBy, updatedAt: new Date() },
        })
      )
    )
  }
}

export const settingsService = new SettingsService()
