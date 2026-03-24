import { prisma } from './src/lib/prisma';
import * as fs from 'fs';
async function run() {
  const f = await prisma.$queryRawUnsafe("SELECT prosrc FROM pg_proc WHERE proname = 'fn_sync_inventory_balance'")
  const src = (f as any)[0]?.prosrc;
  console.log('FUNCTION SOURCE:', src);
  fs.writeFileSync('fn_src.sql', src);
}
run();
