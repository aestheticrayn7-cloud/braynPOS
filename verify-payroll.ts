import { PayslipService } from './apps/api/src/modules/payroll/payslip.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const payslipService = new PayslipService();

async function verify() {
  console.log('--- PAYROLL VERIFICATION RUN (MARCH 2026) ---');
  try {
    const run = await payslipService.createSalaryRun(3, 2026, 'usr-super-admin');
    console.log('Draft Salary Run Created Successfully.');
    
    const savedRun = await prisma.salaryRun.findUnique({
      where: { id: run.salaryRun.id }
    });

    console.log('\nVerified Summary Totals in Database:');
    console.log({
      totalGross: savedRun?.totalGross.toString(),
      totalNet: savedRun?.totalNet.toString(),
      totalDeductions: savedRun?.totalDeductions.toString(),
      employerCost: savedRun?.totalEmployerCost.toString()
    });

    if (run.warnings && run.warnings.length > 0) {
      console.log('\n⚠️ Warnings encountered:');
      run.warnings.forEach(w => console.log('  -', w));
    } else {
      console.log('\n✅ No warnings reported.');
    }

  } catch (err: any) {
    console.error('\n❌ Verification failed:', err.message || err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

verify();
