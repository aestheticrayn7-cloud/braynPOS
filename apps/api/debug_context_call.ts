import { PrismaClient } from '@prisma/client'
import { signAccessToken } from './src/lib/jwt'
import axios from 'axios'

const prisma = new PrismaClient()

async function main() {
  console.log('--- DEBUGGING REQUEST CONTEXT ---')
  const user = await prisma.user.findFirst({ where: { username: 'Evans' } })
  if (!user) return console.log('Evans not found')

  const token = signAccessToken({
    id: user.id,
    sub: user.id,
    email: user.username + '@example.com',
    role: user.role as any,
    channelId: user.channelId
  })

  try {
    const res = await axios.get('http://localhost:8080/v1/dashboard/debug-ctx', {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('DEBUG CONTEXT RESPONSE:', JSON.stringify(res.data, null, 2))
  } catch (err: any) {
    console.error('DEBUG API FAIL:', err.response?.data || err.message)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
