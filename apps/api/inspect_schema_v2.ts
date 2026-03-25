import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function inspect() {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `
    console.log('Tables:', JSON.stringify(tables, null, 2))
    
    // Check 'users' or 'User' table specifically
    const columns = await prisma.$queryRaw`
       SELECT table_name, column_name, data_type, udt_name 
       FROM information_schema.columns 
       WHERE table_schema = 'public' 
       AND (table_name ILIKE '%user%' OR column_name ILIKE '%mfa%');
    `
    console.log('Columns:', JSON.stringify(columns, null, 2))
  } catch (err) {
    console.error('Inspection failed:', err)
  } finally {
    await prisma.$disconnect()
  }
}

inspect()
