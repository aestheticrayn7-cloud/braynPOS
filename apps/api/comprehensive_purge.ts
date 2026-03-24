import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8f39-dcd8dd493de2'
  
  console.log('--- COMPREHENSIVE CHANNEL REFERENCE AUDIT ---')
  
  // 1. Find all tables and columns that reference "channels"("id")
  const references: any[] = await prisma.$queryRaw`
    SELECT 
      tc.table_name, 
      kcu.column_name 
    FROM 
      information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    WHERE 
      tc.constraint_type = 'FOREIGN KEY' 
      AND ccu.table_name = 'channels'
      AND ccu.column_name = 'id'
  `
  
  console.log(`Found ${references.length} columns referencing channels. Moving data...`)

  await prisma.$transaction(async (tx) => {
    for (const { table_name, column_name } of references) {
       if (table_name === 'channels') continue; // Don't move the ID itself!
       
       console.log(`Updating table: ${table_name}, column: ${column_name}...`)
       try {
         const res = await tx.$executeRawUnsafe(`UPDATE "${table_name}" SET "${column_name}" = '${hqId}' WHERE "${column_name}" != '${hqId}'`)
         if (res > 0) console.log(`  Moved ${res} records.`)
       } catch (err) {
         console.log(`  SKIPPED ${table_name}.${column_name} (likely unique constraint collision or recursive FK)`)
       }
    }
  }, { timeout: 30000 })
  
  console.log('\n--- ATTEMPTING FINAL CHANNEL PURGE ---')
  const deleted = await prisma.channel.deleteMany({
    where: { id: { not: hqId } }
  })
  
  console.log(`Deleted ${deleted.count} redundant channels.`)
  
  const remaining = await prisma.channel.findMany()
  console.log('Remaining channels:', remaining.map(c => c.name))
}

main().catch(console.error).finally(() => prisma.$disconnect())
