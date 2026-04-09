import { prisma } from '../../lib/prisma.js'

export class ChecklistService {
  async createTemplate(channelId: string, name: string, fields: any[]) {
    // Audit finding: Vertical Settings / Service Checklist (e.g. Car Condition)
    return (prisma as any).serviceChecklist.create({
      data: { channelId, name, fields }
    })
  }

  async getTemplates(channelId: string) {
    return (prisma as any).serviceChecklist.findMany({ where: { channelId } })
  }

  // We could add 'ChecklistSubmission' model if we wanted to save actual checks per sale,
  // but for now, we'll provide the templates as requested in 'Vertical Settings'.
}

export const checklistService = new ChecklistService()
