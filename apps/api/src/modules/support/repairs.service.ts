import { prisma } from '../../lib/prisma.js'

export class RepairService {
  async createRequest(data: { customerId: string; channelId: string; itemName: string; description: string; problemCategory?: string; estimatedCost?: number }) {
    // Audit finding: Repair Module
    const lastRepair = await (prisma as any).repairRequest.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    const repairNo = `REP-${String((lastRepair ? parseInt(lastRepair.repairNo.split('-')[1]) : 0) + 1).padStart(5, '0')}`

    return (prisma as any).repairRequest.create({
      data: {
        ...data,
        repairNo
      }
    })
  }

  async updateStatus(id: string, status: string, notes?: string, actualCost?: number) {
    return (prisma as any).repairRequest.update({
      where: { id },
      data: { 
        status, 
        notes,
        ...(actualCost && { actualCost })
      }
    })
  }

  async findAll(channelId: string) {
    return (prisma as any).repairRequest.findMany({
      where: { channelId },
      include: { customer: true, assignedUser: true },
      orderBy: { createdAt: 'desc' }
    })
  }
}

export const repairService = new RepairService()
