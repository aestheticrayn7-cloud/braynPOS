import { prisma } from './src/lib/prisma.js'
import { requestContext } from './src/lib/request-context.plugin.js'

async function check() {
  const email = 'admin@brayn.app'

  console.log('--- TEST 1: NO CONTEXT ---')
  const user1 = await prisma.user.findUnique({ where: { email } })
  console.log('User found:', user1 ? 'YES' : 'NO')

  console.log('--- TEST 2: EMPTY CONTEXT (ONLY requestId) ---')
  await requestContext.run({ requestId: 'test-req' }, async () => {
    const user2 = await prisma.user.findUnique({ where: { email } })
    console.log('User found:', user2 ? 'YES' : 'NO')
  })
}

check().catch(console.error).finally(() => prisma.$disconnect())
