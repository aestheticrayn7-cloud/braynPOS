import { PrismaClient } from '@prisma/client'
import { generateToken } from '../src/lib/jwt'

const prisma = new PrismaClient()

async function test() {
  const chris = await prisma.user.findFirst({ where: { username: 'chris' } })
  if (!chris) {
    console.error('User chris not found')
    return
  }

  const token = generateToken({
    sub: chris.id,
    username: chris.username,
    role: chris.role,
    channelId: chris.channelId,
  })

  console.log(`TOKEN_START:${token}:TOKEN_END`)
}

test().catch(console.error).finally(() => prisma.$disconnect())
