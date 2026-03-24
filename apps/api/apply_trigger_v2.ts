import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

async function main() {
  const prisma = new PrismaClient()
  const sql = fs.readFileSync(path.join(__dirname, 'trg_sync_inventory.sql'), 'utf8')
  
  console.log('Applying trigger SQL...')
  // Split by -- and handle individual statements if needed, but here a simple split isn't reliable for functions.
  // We'll try running it as one block. Postgres handles multiple statements in some contexts.
  // Actually, we'll split by the common statement separator if possible, or just run the whole thing.
  
  try {
    await prisma.$executeRawUnsafe(sql)
    console.log('Trigger SQL applied successfully.')
    
    // Verification
    const res: any = await prisma.$queryRawUnsafe(`
      SELECT tgname, tgenabled, tgtype
      FROM pg_trigger
      WHERE tgrelid = 'stock_movements'::regclass
        AND tgname = 'trg_sync_inventory';
    `)
    console.log('Verification result:', JSON.stringify(res, null, 2))
  } catch (err) {
    console.error('Failed to apply trigger:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)
