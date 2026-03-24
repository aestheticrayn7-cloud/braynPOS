import { prisma } from './src/lib/prisma';
async function run() {
  const c = await prisma.$queryRawUnsafe("SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'inventory_balances' AND column_name = 'lastMovementAt'")
  console.log('COLUMN DEF:', JSON.stringify(c, null, 2))
}
run();
