import 'dotenv/config'
import { prisma } from './src/lib/prisma.js'

async function run() {
  try {
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'journal_entries' ORDER BY column_name`
    )
    const cols = rows.map((r: any) => r.column_name)
    console.log('journal_entries columns:', cols.join(', '))
    console.log('reversedAt present:', cols.includes('reversed_at') || cols.includes('reversedAt') ? '✅ YES' : '❌ MISSING')
  } catch(e: any) {
    console.error('QUERY FAILED:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

run()
