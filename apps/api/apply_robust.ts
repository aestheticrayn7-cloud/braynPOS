import { PrismaClient } from '@prisma/client'
import fs from 'fs'
const prisma = new PrismaClient()

async function apply() {
  const sql = fs.readFileSync('trg_sync_inventory.sql', 'utf8')
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`Applying ${statements.length} SQL statements from trg_sync_inventory.sql...`)
  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement)
    } catch (err) {
      console.error('Failed statement:', statement)
      throw err
    }
  }
  console.log('Applied all statements successfully.')
}

apply().catch(console.error).finally(() => prisma.$disconnect())
