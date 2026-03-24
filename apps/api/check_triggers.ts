import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const triggers: any[] = await prisma.$queryRaw`
    SELECT trigger_name, event_manipulation, event_object_table, action_statement
    FROM information_schema.triggers
    WHERE event_object_table = 'stock_movements';
  `
  console.log('Triggers on stock_movements:', JSON.stringify(triggers, null, 2))

  const functions: any[] = await prisma.$queryRaw`
    SELECT routine_name
    FROM information_schema.routines
    WHERE routine_name = 'fn_sync_inventory_balance';
  `
  console.log('Inventory Sync Function:', JSON.stringify(functions, null, 2))
  
  const balances = await (prisma as any).inventory_balances.findMany({ take: 5 })
  console.log('Sample Balances:', JSON.stringify(balances, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
