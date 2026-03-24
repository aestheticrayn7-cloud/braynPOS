import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkTriggers() {
  const res = await prisma.$queryRawUnsafe(`
    SELECT trigger_name, event_manipulation, event_object_table, action_statement
    FROM information_schema.triggers
    WHERE event_object_table = 'stock_movements';
  `)
  console.log('TRIGGERS ON stock_movements:', JSON.stringify(res, null, 2))
  
  const pgTriggers = await prisma.$queryRawUnsafe(`
    SELECT tgname FROM pg_trigger WHERE tgrelid = 'stock_movements'::regclass;
  `)
  console.log('PG_TRIGGERS:', JSON.stringify(pgTriggers, null, 2))
}

checkTriggers().finally(() => prisma.$disconnect())
