import { prisma } from './src/lib/prisma';

async function main() {
  const channels = await prisma.channel.findMany({ select: { id: true, code: true, name: true } });
  const users = await prisma.user.findMany({ select: { id: true, username: true, role: true } });
  console.log(JSON.stringify({ channels, users }, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
