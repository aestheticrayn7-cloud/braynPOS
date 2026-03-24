import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const indexes: any = await prisma.$queryRaw`
    SELECT
        tablename,
        indexname,
        indexdef
    FROM
        pg_indexes
    WHERE
        schemaname = 'public'
    ORDER BY
        tablename,
        indexname;
  `
  console.log('--- DATABASE INDEXES ---')
  console.log(JSON.stringify(indexes, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
