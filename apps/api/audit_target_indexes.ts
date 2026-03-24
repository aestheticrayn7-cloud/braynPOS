import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const result: any = await prisma.$queryRaw`
    SELECT
        tablename,
        indexname,
        indexdef
    FROM
        pg_indexes
    WHERE
        tablename IN ('channels', 'items', 'users')
    ORDER BY
        tablename;
  `
  console.log('--- TARGET INDEXES ---')
  console.log(JSON.stringify(result, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
