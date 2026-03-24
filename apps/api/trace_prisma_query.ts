import { PrismaClient } from '@prisma/client'
import { multiTenantExtension } from './src/lib/prisma-multi-tenant.extension'
import { requestContext } from './src/lib/request-context.plugin'

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }]
})

// @ts-ignore
prisma.$on('query', (e) => {
  console.log('--- RAW SQL QUERY ---')
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('----------------------')
})

const extendedPrisma = prisma.$extends(multiTenantExtension)

async function main() {
  const evans = await prisma.user.findFirst({ where: { username: 'Evans' } })
  if (!evans) return console.log('Evans not found')

  console.log(`Simulating context for Evans: ${evans.id}, channel: ${evans.channelId}`)

  await requestContext.run({ 
    requestId: 'trace-123',
    userId: evans.id,
    role: evans.role as any,
    channelId: evans.channelId ?? undefined
  }, async () => {
    try {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      console.log('Running aggregate query...')
      await (extendedPrisma as any).sale.aggregate({
        where: {
          deletedAt: null,
          createdAt: { gte: today },
          channelId: evans.channelId // Providing it explicitly as in dashboard routes
        },
        _count: true
      })
    } catch (err: any) {
      console.error('QUERY ERROR:', err.message)
    }
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
