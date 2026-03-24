import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const tables = ['inventory_balances', 'sales', 'sale_items', 'receipt_sequences', 'channels', 'items']
  let output = ''
  
  for (const table of tables) {
    output += `\n--- Schema for table: ${table} ---\n`
    const result = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = '${table}'
      ORDER BY column_name
    `)
    ;(result as any[]).forEach(row => {
      output += `Column: ${row.column_name.padEnd(25)} | Type: ${row.data_type.padEnd(25)} | UDT: ${row.udt_name}\n`
    })
  }
  
  fs.writeFileSync('c:\\Users\\HP\\Desktop\\braynPOS\\apps\\api\\db_schema_debug.txt', output)
  console.log("Output written to db_schema_debug.txt")
}

main().catch(console.error).finally(() => prisma.$disconnect())
