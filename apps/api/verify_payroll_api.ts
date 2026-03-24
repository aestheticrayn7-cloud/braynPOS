import { PayslipService } from './src/modules/payroll/payslip.service.ts';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const payslipService = new PayslipService();

async function main() {
  console.log('--- PAYROLL FINAL VERIFICATION (VIA API SRC) ---');
  try {
    const run = await (payslipService as any).createSalaryRun(3, 2026, 'usr-super-admin');
    console.log(`Draft run ${run.salaryRun.id} created.`);
    
    console.log('\nResults:');
    console.log({
      gross: run.salaryRun.totalGross.toString(),
      net: run.salaryRun.totalNet.toString(),
      deductions: run.salaryRun.totalDeductions.toString()
    });
    
    if (run.warnings) {
      console.log('\nWarnings:');
      run.warnings.forEach((w: string) => console.log('  -', w));
    }
  } catch (err: any) {
    console.error('Error:', err.message || err);
  } finally {
    process.exit(0);
  }
}

main();
