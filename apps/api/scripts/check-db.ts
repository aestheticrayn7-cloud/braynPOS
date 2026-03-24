// apps/api/scripts/check-db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking extensions...')
  const extensions = await prisma.$queryRaw<any[]>`SELECT name FROM pg_available_extensions;`
  const hasVector = extensions.some(e => e.name === 'vector')
  
  if (hasVector) {
    console.log('✅ pgvector IS available in pg_available_extensions.')
  } else {
    console.log('❌ pgvector is NOT available.')
    console.log('Available extensions snippets:', extensions.slice(0, 5).map(e => e.name))
  }
  
  const pgVersion = await prisma.$queryRaw<any[]>`SELECT version();`
  console.log('PostgreSQL version:', pgVersion[0].version)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
