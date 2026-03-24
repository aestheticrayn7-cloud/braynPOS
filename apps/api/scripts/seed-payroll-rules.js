const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding Payroll Rules...');

  // 1. NSSF (Fixed for simplicity, or could be tiered)
  const nssf = await prisma.deductionRule.upsert({
    where: { id: 'rule-nssf' },
    update: {},
    create: {
      id: 'rule-nssf',
      name: 'NSSF (Social Security)',
      type: 'FIXED_AMOUNT',
      rate: 1080,
      isPreTaxDeduction: true,
      calculationSequence: 10,
      isEmployerContribution: false,
    },
  });

  // 2. NHIF (Tiered)
  const nhif = await prisma.deductionRule.upsert({
    where: { id: 'rule-nhif' },
    update: {},
    create: {
      id: 'rule-nhif',
      name: 'NHIF (Health Insurance)',
      type: 'BRACKET_TABLE',
      calculationSequence: 20,
      brackets: {
        create: [
          { incomeFrom: 0, incomeTo: 5999, ratePercentage: 0, fixedDeduction: 150 },
          { incomeFrom: 6000, incomeTo: 7999, ratePercentage: 0, fixedDeduction: 300 },
          { incomeFrom: 8000, incomeTo: 11999, ratePercentage: 0, fixedDeduction: 400 },
          { incomeFrom: 12000, incomeTo: 14999, ratePercentage: 0, fixedDeduction: 500 },
          { incomeFrom: 15000, incomeTo: 999999, ratePercentage: 0, fixedDeduction: 600 },
        ],
      },
    },
  });

  // 3. PAYE (Progressive Tax)
  const paye = await prisma.deductionRule.upsert({
    where: { id: 'rule-paye' },
    update: {},
    create: {
      id: 'rule-paye',
      name: 'PAYE (Income Tax)',
      type: 'BRACKET_TABLE',
      isPreTaxDeduction: false, // Calculated after pre-tax deductions like NSSF
      calculationSequence: 100,
      brackets: {
        create: [
          { incomeFrom: 0, incomeTo: 24000, ratePercentage: 10, fixedDeduction: 0 },
          { incomeFrom: 24001, incomeTo: 32333, ratePercentage: 25, fixedDeduction: 0 },
          { incomeFrom: 32334, incomeTo: 999999, ratePercentage: 30, fixedDeduction: 0 },
        ],
      },
    },
  });

  console.log('Seed completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
