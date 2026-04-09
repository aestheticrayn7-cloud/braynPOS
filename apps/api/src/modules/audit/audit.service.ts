import { prisma } from '../../lib/prisma.js'
import { logAction, AUDIT } from '../../lib/audit.js'

export class AuditService {
  /**
   * Authoritatively swaps or corrects a serial number on a specific sale item.
   * This is a forensic tool for correcting "fat-finger" errors.
   */
  async swapSerialNumber(data: {
    saleId:      string
    itemId:      string
    oldSerialId: string | null
    newSerialNo: string
    reason:      string
    actorId:     string
  }) {
    const { saleId, itemId, oldSerialId, newSerialNo, reason, actorId } = data

    return prisma.$transaction(async (tx) => {
      // 1. Verify the sale and item association
      const saleItem = await tx.saleItem.findFirstOrThrow({
        where: { saleId, itemId }
      })

      // 2. Fetch actor info for auditing
      const actor = await tx.user.findUniqueOrThrow({
        where: { id: actorId },
        select: { role: true, channelId: true }
      })

      // 3. Find/Verify the specific serial record if oldId provided
      // If oldId is null, we are attaching a serial to a non-serialized sale (if allowed)
      let oldSerialNo = 'NONE'
      if (oldSerialId) {
        const serialRecord = await tx.serial.findUniqueOrThrow({
          where: { id: oldSerialId }
        })
        oldSerialNo = serialRecord.serialNo
        
        // Update the existing record or create a replacement audit
        await tx.serial.update({
          where: { id: oldSerialId },
          data: { 
            serialNo: newSerialNo,
            updatedAt: new Date()
          }
        })
      }

      // 4. Log the Serial Audit specifically
      await tx.serialAudit.create({
        data: {
          serialId:     oldSerialId || 'NEW',
          action:       'SWAP',
          oldSerialNo,
          newSerialNo,
          reason,
          performedBy:  actorId,
        }
      })

      // 5. Log the general system Action Audit
      logAction({
        action:     AUDIT.SERIAL_ADJUST,
        actorId,
        actorRole:  actor.role,
        channelId:  actor.channelId || 'HQ',
        targetType: 'Sale',
        targetId:   saleId,
        newValues:  { oldSerialNo, newSerialNo, reason }
      })

      return {
        success: true,
        message: `Serial swapped from ${oldSerialNo} to ${newSerialNo}`,
        auditId: saleId
      }
    })
  }

  async getSerialAudits(limit = 20) {
    return (prisma as any).serialAudit.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }
}

export const auditService = new AuditService()
