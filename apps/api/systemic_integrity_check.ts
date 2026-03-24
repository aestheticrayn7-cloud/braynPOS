import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function integrityAudit() {
  console.log('--- SYSTEMIC INVENTORY INTEGRITY AUDIT ---')
  
  // Phase 1: Auditing Sales vs Movements
  console.log('Phase 1: Auditing Sales vs Movements')
  const sales = await prisma.sale.findMany({
    include: { items: true }
  })

  let salesFixed = 0
  for (const sale of sales) {
    const stockMovements = await prisma.stockMovement.findMany({
      where: { referenceId: sale.id }
    })

    if (sale.deletedAt) {
      // Reversed sales should have a RETURN movement
      const returnMoves = stockMovements.filter(m => m.movementType === 'RETURN')
      if (returnMoves.length === 0) {
        console.log(`[!] Sale ${sale.receiptNo} reversed but missing RETURN movement. Fixing...`)
        for (const item of sale.items) {
          await prisma.stockMovement.create({
            data: {
              itemId: item.itemId,
              channelId: sale.channelId,
              movementType: 'RETURN',
              quantityChange: item.quantity,
              referenceId: sale.id,
              referenceType: 'sale_reversal',
              performedBy: sale.performedBy,
              notes: 'Systemic Recovery: Missing Reversal Movement'
            }
          })
        }
        salesFixed++
      }
    } else {
      // Active sales should have a SALE movement
      const saleMoves = stockMovements.filter(m => m.movementType === 'SALE')
      if (saleMoves.length === 0) {
        console.log(`[!] Sale ${sale.receiptNo} active but missing SALE movement. Fixing...`)
        for (const item of sale.items) {
          await prisma.stockMovement.create({
            data: {
              itemId: item.itemId,
              channelId: sale.channelId,
              movementType: 'SALE',
              quantityChange: -(item.quantity),
              referenceId: sale.id,
              referenceType: 'sale',
              performedBy: sale.performedBy,
              notes: 'Systemic Recovery: Missing Sale Movement'
            }
          })
        }
        salesFixed++
      }
    }
  }
  console.log(`Sales Audit complete. Fixed ${salesFixed} records.`)

  // Phase 2: Auditing Purchases vs Movements
  console.log('\nPhase 2: Auditing Purchases vs Movements')
  const purchases = await prisma.purchase.findMany({
    include: { lines: true }
  })
  
  let purchaseFixed = 0
  for (const purchase of purchases) {
    const movements = await prisma.stockMovement.findMany({
      where: { referenceId: purchase.id }
    })
    
    if (purchase.deletedAt) {
      const voidMoves = movements.filter(m => m.referenceType === 'purchase_void' || m.movementType === 'ADJUSTMENT_OUT')
      if (voidMoves.length === 0) {
        console.log(`[!] Purchase ${purchase.purchaseNo} deleted but missing VOID movement. Fixing...`)
        for (const line of purchase.lines) {
          await prisma.stockMovement.create({
            data: {
              itemId: line.itemId,
              channelId: purchase.channelId,
              movementType: 'ADJUSTMENT_OUT',
              quantityChange: -(line.quantity),
              referenceId: purchase.id,
              referenceType: 'purchase_void',
              performedBy: purchase.committedBy || 'system',
              notes: 'Systemic Recovery: Missing Void Movement'
            }
          })
        }
        purchaseFixed++
      }
    } else {
      const purchaseMoves = movements.filter(m => m.movementType === 'PURCHASE')
      if (purchaseMoves.length === 0) {
        console.log(`[!] Purchase ${purchase.purchaseNo} active but missing movement. Fixing...`)
        for (const line of purchase.lines) {
          await prisma.stockMovement.create({
            data: {
              itemId: line.itemId,
              channelId: purchase.channelId,
              movementType: 'PURCHASE',
              quantityChange: line.quantity,
              referenceId: purchase.id,
              referenceType: 'purchase',
              performedBy: purchase.committedBy || 'system',
              notes: 'Systemic Recovery: Missing Purchase Movement'
            }
          })
        }
        purchaseFixed++
      }
    }
  }
  console.log(`Purchase Audit complete. Fixed ${purchaseFixed} records.`)

  // Phase 3: Final Balance Recalculation (Factory Reset)
  console.log('\nPhase 3: Final Balance Recalculation (Factory Reset)')
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE inventory_balances`)
  
  await prisma.$executeRawUnsafe(`
    INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty")
    SELECT 
      "itemId", 
      "channelId", 
      SUM(CASE WHEN "movementType" != 'TRANSFER_IN_PENDING' THEN "quantityChange" ELSE 0 END) as "availableQty",
      SUM(CASE WHEN "movementType" = 'TRANSFER_IN_PENDING' THEN "quantityChange" ELSE 0 END) as "incomingQty"
    FROM stock_movements
    GROUP BY "itemId", "channelId"
  `)
  
  console.log('Balance recalculation complete.')
  console.log('--- AUDIT SUCCESSFUL ---')
}

integrityAudit().finally(() => prisma.$disconnect())
