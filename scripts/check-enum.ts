import { prisma } from '../apps/api/src/lib/prisma'

async function main() {
  try {
    const res = await prisma.$queryRaw`SELECT enum_range(NULL::"MovementType")`
    console.log('MovementType Enum Range:', res)
  } catch (err) {
    console.error('Failed to fetch enum range:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
