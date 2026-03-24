import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function sync() {
  const sqlPath = path.join(__dirname, 'prisma', 'sql', 'inventory_trigger.sql')
  const content = fs.readFileSync(sqlPath, 'utf8')

  // Remove comments and split by -- ════
  const sections = content.split(/-- ──/g).map(s => s.trim()).filter(s => s.length > 0)

  for (const rawSection of sections) {
    // Extract actual SQL (everything after the first newline of the section name)
    const lines = rawSection.split('\n')
    const sql = lines.slice(1).join('\n').trim()
    
    if (!sql) continue
    
    console.log('--- Executing Section ---')
    // console.log(sql)
    try {
      await prisma.$executeRawUnsafe(sql)
      console.log('Success')
    } catch (err) {
      console.error('Failed section:', err)
    }
  }
  
  // Also run the "Initial Population" part specifically if it failed
  console.log('Running final population check...')
  try {
    await prisma.$executeRawUnsafe(`
      INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty")
      SELECT 
        "itemId", 
        "channelId", 
        SUM(CASE WHEN "movementType" != 'TRANSFER_IN_PENDING' THEN "quantityChange" ELSE 0 END) as "availableQty",
        SUM(CASE WHEN "movementType" = 'TRANSFER_IN_PENDING' THEN "quantityChange" ELSE 0 END) as "incomingQty"
      FROM stock_movements
      GROUP BY "itemId", "channelId"
      ON CONFLICT ("itemId", "channelId") DO UPDATE
        SET "availableQty" = EXCLUDED."availableQty",
            "incomingQty"  = EXCLUDED."incomingQty";
    `)
    console.log('Population Complete!')
  } catch (e) {
    console.error('Population fail:', e)
  }
}

sync().finally(() => prisma.$disconnect())
