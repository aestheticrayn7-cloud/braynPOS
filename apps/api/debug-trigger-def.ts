import { prisma } from './src/lib/prisma';
async function run() {
  const d = await prisma.$queryRawUnsafe("SELECT action_statement FROM information_schema.triggers WHERE trigger_name = 'trg_sync_inventory'")
  console.log('TRIGGER DEF:', JSON.stringify(d, null, 2))
}
run();
