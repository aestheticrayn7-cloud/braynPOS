import { prisma } from './src/lib/prisma';
async function run() {
  const t = await prisma.$queryRawUnsafe("SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE event_object_table IN ('items', 'inventory_balances', 'stock_movements')")
  console.log('TRIGGERS:', JSON.stringify(t, null, 2))
}
run();
