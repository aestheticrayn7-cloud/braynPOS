import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const sqlPath = path.join(__dirname, 'prisma', 'sql', 'inventory_trigger.sql')
  console.log('Reading SQL from:', sqlPath)
  const sql = fs.readFileSync(sqlPath, 'utf8')
  
  // Split the SQL into individual statements if necessary, 
  // but $executeRawUnsafe can often handle multiple statements for simple triggers.
  // Actually, standard practice for complex scripts is to run them carefully.
  
  try {
    console.log('Installing triggers...')
    await prisma.$executeRawUnsafe(sql)
    console.log('✅ Triggers and initial population completed.')
  } catch (err: any) {
    console.error('❌ Error installing triggers:', err.message)
    // If it fails due to multiple statements, I'll split by ';'
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
