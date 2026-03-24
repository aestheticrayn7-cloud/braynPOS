import { prisma } from '../../lib/prisma.js'

export class SettingsService {
  /**
   * Fetch all settings for a channel, merged with global defaults.
   * Local channel settings override global ones.
   */
  async getAll(channelId?: string | null) {
    // 1. Fetch Global Settings
    const globalSettings = await prisma.setting.findMany({
      where: { channelId: null }
    })

    // 2. Fetch Channel Settings (if provided)
    const channelSettings = channelId ? await prisma.setting.findMany({
      where: { channelId }
    }) : []

    // 3. Merge (Channel overrides Global)
    const merged: Record<string, any> = {}
    
    globalSettings.forEach(s => { merged[s.key] = s.value })
    channelSettings.forEach(s => { merged[s.key] = s.value })

    return merged
  }

  async getByKey(key: string, channelId?: string | null) {
    // 1. Fetch all settings for this key (Global + all channels)
    // This bypasses Prisma 5's strict null-validation on composite unique indices.
    const all = await prisma.setting.findMany({
      where: { key }
    })

    // 2. Try to find local match
    if (channelId) {
      const local = all.find(s => s.channelId === channelId)
      if (local) return local.value
    }

    // 3. Try to find global match
    const global = all.find(s => s.channelId === null)
    return global?.value ?? null
  }

  async update(key: string, value: any, updatedBy: string, channelId: string | null = null) {
    // Use findMany + JS filter to avoid the composite unique index "null" validation crash in Prisma 5
    const all = await prisma.setting.findMany({
      where: { key }
    })
    const existing = all.find(s => s.channelId === channelId)

    if (existing) {
      return prisma.setting.update({
        where: { id: existing.id },
        data: { value, updatedBy, updatedAt: new Date() }
      })
    }

    return prisma.setting.create({
      data: { key, value, channelId, updatedBy }
    })
  }

  async bulkUpdate(settings: Record<string, any>, updatedBy: string, channelId: string | null = null) {
    for (const [key, value] of Object.entries(settings)) {
      await this.update(key, value, updatedBy, channelId)
    }
  }
}

export const settingsService = new SettingsService()
