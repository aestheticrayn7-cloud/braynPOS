import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function inspect() {
  try {
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'mfaRecoveryCodes';
    `
    console.log('Column Info:', JSON.stringify(tableInfo, null, 2))
  } catch (err) {
    console.error('Inspection failed:', err)
  } finally {
    await prisma.$disconnect()
  }
}

inspect()
