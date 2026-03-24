import { prisma } from './src/lib/prisma'

async function main() {
  console.log('--- STARTING VERIFICATION ---')
  try {
    const channelCount = await prisma.channel.count()
    console.log('ACTIVE CHANNELS:', channelCount)
    
    const salesToday = await prisma.sale.count({
      where: {
        createdAt: { gte: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())) }
      }
    })
    console.log('SALES TODAY:', salesToday)
  } catch (err) {
    console.error('VERIFICATION ERROR:', err)
  } finally {
    process.exit(0)
  }
}

main()
