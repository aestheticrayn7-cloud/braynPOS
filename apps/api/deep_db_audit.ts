import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const tables: any[] = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  `
  console.log('--- ALL TABLES ---')
  console.log(tables.map(t => t.table_name))
  
  const hqs: any[] = await prisma.$queryRaw`SELECT id FROM channels WHERE name = 'Headquarters'`
  console.log('\n--- HQS IN DB ---')
  console.log(hqs)
  
  const users: any[] = await prisma.$queryRaw`SELECT id, username, "channelId" FROM users`
  console.log('\n--- USERS IN DB ---')
  console.log(users)
}

main().catch(console.error).finally(() => prisma.$disconnect())
