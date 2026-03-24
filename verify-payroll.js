const { PayslipService } = require('./apps/api/src/modules/payroll/payslip.service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const payslipService = new PayslipService();

async function verify() {
  console.log('Creating March 2026 Salary Run...');
  try {
    // usr-super-admin is the actor sub
    const run = await payslipService.createSalaryRun(3, 2026, 'usr-super-admin');
    console.log('Salary Run Created Successfully:');
    console.log(JSON.stringify(run, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));
    
    // Check if totals are populated
    const savedRun = await prisma.salaryRun.findUnique({
      where: { id: run.salaryRun.id }
    });
    console.log('\nVerified Summary Totals in DB:');
    console.log({
      totalGross: savedRun.totalGross.toString(),
      totalNet: savedRun.totalNet.toString(),
      totalDeductions: savedRun.totalDeductions.toString()
    });
  } catch (err) {
    console.error('Verification failed:', err);
  }
  process.exit(0);
}

verify();
