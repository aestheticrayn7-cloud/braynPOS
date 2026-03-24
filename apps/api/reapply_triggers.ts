import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function sync() {
  const sqlPath = path.join(__dirname, 'prisma', 'sql', 'inventory_trigger.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  // Split by semicolon but be careful with functions
  // Better: just try to execute the whole thing if PostgreSQL allows it in a single batch
  // Or use a more robust splitter.
  
  console.log('Applying SQL from:', sqlPath)
  
  try {
    // We'll try to execute it as a single block if possible, or split by common patterns
    // Actually, prisma executeRaw handles multiple statements if separated by ; usually
    await prisma.$executeRawUnsafe(sql)
    console.log('Successfully applied inventory triggers!')
  } catch (err) {
    console.error('Failed to apply triggers:', err)
  }
}

sync().finally(() => prisma.$disconnect())
