import 'dotenv/config'
import { prisma } from './src/lib/prisma.js'

async function fix() {
  console.log('🔧 Running direct schema fix...')
  try {
    // Step 1: Drop the wrong snake_case column if it exists
    await prisma.$queryRawUnsafe(`ALTER TABLE "journal_entries" DROP COLUMN IF EXISTS "reversed_at"`)
    console.log('✅ Dropped reversed_at (snake_case) if it existed')

    // Step 2: Add the correct camelCase column
    await prisma.$queryRawUnsafe(`ALTER TABLE "journal_entries" ADD COLUMN IF NOT EXISTS "reversedAt" TIMESTAMP(3)`)
    console.log('✅ Added reversedAt (camelCase) column')

    // Step 3: Verify
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'journal_entries' ORDER BY column_name`
    )
    const cols = rows.map((r: any) => r.column_name)
    console.log('journal_entries columns:', cols.join(', '))
    console.log('reversedAt present:', cols.includes('reversedAt') ? '✅ YES — column is now live!' : '❌ STILL MISSING')
  } catch(e: any) {
    console.error('FAILED:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

fix()
