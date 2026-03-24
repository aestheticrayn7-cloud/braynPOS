import { prisma } from './src/lib/prisma';
async function run() {
  const f = await prisma.$queryRawUnsafe("SELECT prosrc FROM pg_proc WHERE proname = 'fn_sync_inventory_balance'")
  console.log('FUNCTION SOURCE:', (f as any)[0]?.prosrc)
}
run();
