import { basePrisma } from './src/lib/prisma.js'

async function check() {
  console.log('--- USER STATUS CHECK (APP CLIENT) ---')
  try {
    const users = await basePrisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, status: true, deletedAt: true }
    })
    console.log(`Found ${users.length} users.`)
    console.log(JSON.stringify(users, null, 2))
  } catch (err) {
    console.error('Prisma Error:', err)
  }
}

check().catch(console.error).finally(() => basePrisma.$disconnect())
