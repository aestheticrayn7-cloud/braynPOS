import { PrismaClient } from '@prisma/client'
import { calculateNetSalary } from '../src/modules/payroll/payroll-calculator.service'

const prisma = new PrismaClient()

async function main() {
  const staff = await prisma.staffProfile.findMany({
    where: { user: { username: { in: ['Hildah', 'chris'] } } },
  })

  for (const s of staff) {
    const calc = await calculateNetSalary(s.id)
    console.log(`User: ${calc.userName}`)
    console.log(`  Base Gross: ${calc.grossSalary}`)
    console.log(`  Allowances: ${calc.allowancesTotal}`)
    console.log(`  Total Gross: ${calc.grossWithAllowances}`)
    console.log(`  Deductions: ${calc.deductions.filter(d => !d.isEmployerContribution).reduce((s,d) => s+d.amount, 0)}`)
    console.log(`  Net: ${calc.netSalary}`)
    console.log('-------------------')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
