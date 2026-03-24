import { prisma } from './src/lib/prisma';

async function main() {
  const allChannels = await prisma.$queryRaw`SELECT id, name, "deletedAt" FROM channels`;
  console.log("All channels in DB:");
  console.log(JSON.stringify(allChannels, null, 2));

  const activeChannels = await prisma.$queryRaw`SELECT id, name, "deletedAt" FROM channels WHERE "deletedAt" IS NULL`;
  console.log("Active channels (deletedAt IS NULL):");
  console.log(JSON.stringify(activeChannels, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
