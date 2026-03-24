const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('--- DATABASE HEALTH CHECK ---');
    
    const users = await prisma.user.count();
    const channels = await prisma.channel.count();
    const items = await prisma.item.count();
    const sales = await prisma.sale.count();
    
    console.log('Status: CONNECTED');
    console.log(`Users: ${users}`);
    console.log(`Channels: ${channels}`);
    console.log(`Items: ${items}`);
    console.log(`Sales: ${sales}`);
    
    // Check for any obvious orphans or inconsistencies
    // Note: Some drivers/versions of Prisma error on null with certain count syntaxes
    let orphans = 0;
    try {
      orphans = await prisma.sale.count({
        where: { channelId: { equals: null } }
      });
    } catch (e) {
      // Fallback for some prisma configs
      const allSales = await prisma.sale.findMany({ select: { channelId: true } });
      orphans = allSales.filter(s => !s.channelId).length;
    }
    console.log(`Sales without Channel (orphans): ${orphans}`);

    process.exit(0);
  } catch (e) {
    console.error('Status: DISCONNECTED');
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
