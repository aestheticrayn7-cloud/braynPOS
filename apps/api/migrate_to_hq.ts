import { prisma } from './src/lib/prisma'

const HQ_ID = 'c7983e54-a3b0-49be-b8bc-86b1bb01bd25'

async function migrateData() {
  console.log('Starting data migration to HQ...')

  const models = [
    'customer',
    'supplier',
    'category',
    'brand',
    'deductionRule',
    'allowanceRule',
    'taxConnectorConfig',
    'documentTemplate'
  ]

  for (const model of models) {
    // @ts-ignore
    const result = await prisma[model].updateMany({
      where: { channelId: null },
      data: { channelId: HQ_ID }
    })
    console.log(`Migrated ${result.count} ${model} records to HQ.`)
  }

  console.log('Migration complete.')
}

migrateData().finally(() => prisma.$disconnect())
