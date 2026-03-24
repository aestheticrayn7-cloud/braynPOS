import { prisma } from './src/lib/prisma';
async function main() {
  const rules = await prisma.commissionRule.findMany();
  console.log('RULES:', JSON.stringify(rules, null, 2));
  const entries = await prisma.commissionEntry.findMany({ take: 5 });
  console.log('ENTRIES:', JSON.stringify(entries, null, 2));
}
main();
