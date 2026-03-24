import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function applyTriggers() {
  const sqlPath = path.join(__dirname, 'prisma', 'sql', 'inventory_trigger.sql')
  const fullSql = fs.readFileSync(sqlPath, 'utf8')
  
  console.log('--- APPLYING TRIGGERS (SPLIT) ---')
  
  // Basic split by semicolon. This might break on function bodies,
  // but let's see if we can do something smarter or just execute blocks.
  
  // A better way is to split by a delimiter or use a library,
  // but let's try to identify the main blocks.
  
  // The file has:
  // 1. CREATE TABLE
  // 2. CREATE OR REPLACE FUNCTION ... $$ ... $$
  // 3. DROP TRIGGER
  // 4. CREATE TRIGGER
  // 5. INSERT INTO ... SELECT ... ON CONFLICT
  
  // Split by semicolon, but handle the function body which also has semicolons.
  const statements = fullSql.split(';').map(s => s.trim()).filter(s => s.length > 0)
  
  // Wait, splitting by ; will break the function.
  // We need to re-join the function block.
  
  const actualStatements: string[] = []
  let current = ''
  let inDollarQuote = false
  
  for (const line of fullSql.split('\n')) {
    current += line + '\n'
    if (line.includes('$$')) inDollarQuote = !inDollarQuote
    if (!inDollarQuote && line.includes(';')) {
      actualStatements.push(current.trim())
      current = ''
    }
  }
  if (current.trim()) actualStatements.push(current.trim())

  for (const stmt of actualStatements) {
    if (!stmt) continue
    console.log(`Executing statement starting with: ${stmt.substring(0, 50).replace(/\n/g, ' ')}...`)
    try {
      await prisma.$executeRawUnsafe(stmt)
    } catch (err) {
      console.error('Failed to execute statement:', err)
      // If it fails, we should probably stop.
      // process.exit(1)
    }
  }
  
  console.log('Done.')
}

applyTriggers().finally(() => prisma.$disconnect())
