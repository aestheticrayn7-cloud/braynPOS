import { PrismaClient } from '@prisma/client'
import { signAccessToken } from './src/lib/jwt'
import axios from 'axios'

const prisma = new PrismaClient()

async function main() {
  console.log('--- FINAL API TEST WITH STACK ---')
  const user = await prisma.user.findFirst({ where: { username: 'Evans' } })
  if (!user) return console.log('Evans not found')

  const token = signAccessToken({
    id: user.id,
    sub: user.id,
    email: user.username + '@example.com',
    role: user.role as any,
    channelId: user.channelId
  })

  // Set NODE_ENV to development for the request if possible? 
  // No, the server must be in dev mode.
  
  try {
    const res = await axios.get('http://localhost:8080/v1/dashboard/summary', {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('FULL RESPONSE:', JSON.stringify(res.data, null, 2))
  } catch (err: any) {
    console.error('API FAIL:', JSON.stringify(err.response?.data || err.message, null, 2))
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
