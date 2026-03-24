import { PrismaClient } from '@prisma/client'
import { calculateNetSalary } from '../src/modules/payroll/payroll-calculator.service'

const prisma = new PrismaClient()

async function main() {
  console.log('--- PAYROLL BOOTSTRAP START ---')

  // 1. Assign staff to Job Level (string-based)
  const staffUpdate = await prisma.staffProfile.updateMany({
    data: { jobLevelId: 'lvl-staff' },
  })
  console.log(`✅ Assigned ${staffUpdate.count} staff members to "lvl-staff" job level.`)

  // 3. Clear existing rules to avoid duplicates
  await prisma.deductionBracket.deleteMany({})
  await prisma.deductionRule.deleteMany({})
  console.log('🧹 Cleaned existing deduction rules.')

  // 4. Create NSSF (Tiered 6%)
  // Combined simplified NSSF rule for demonstration
  const nssfRule = await prisma.deductionRule.create({
    data: {
      name:                'NSSF (Employee)',
      type:                'PERCENTAGE_OF_GROSS',
      rate:                6,
      maximumCapAmount:    2160,
      isPreTaxDeduction:   true,
      calculationSequence: 10,
    },
  })
  console.log('✅ NSSF Rule created.')

  // 5. Create NHIF (Bracket Table)
  const nhifRule = await prisma.deductionRule.create({
    data: {
      name:                'NHIF',
      type:                'BRACKET_TABLE',
      calculationSequence: 20,
    },
  })

  await prisma.deductionBracket.createMany({
    data: [
      { ruleId: nhifRule.id, incomeFrom: 0,      incomeTo: 5999,   ratePercentage: 0, fixedDeduction: 150 },
      { ruleId: nhifRule.id, incomeFrom: 6000,   incomeTo: 7999,   ratePercentage: 0, fixedDeduction: 300 },
      { ruleId: nhifRule.id, incomeFrom: 8000,   incomeTo: 11999,  ratePercentage: 0, fixedDeduction: 400 },
      { ruleId: nhifRule.id, incomeFrom: 12000,  incomeTo: 14999,  ratePercentage: 0, fixedDeduction: 500 },
      { ruleId: nhifRule.id, incomeFrom: 15000,  incomeTo: 19999,  ratePercentage: 0, fixedDeduction: 600 },
      { ruleId: nhifRule.id, incomeFrom: 20000,  incomeTo: 24999,  ratePercentage: 0, fixedDeduction: 750 },
      { ruleId: nhifRule.id, incomeFrom: 25000,  incomeTo: null,   ratePercentage: 0, fixedDeduction: 850 },
    ],
  })
  console.log('✅ NHIF Brackets created.')

  // 6. Create PAYE (Simplified with Relief)
  const payeRule = await prisma.deductionRule.create({
    data: {
      name:                'PAYE',
      type:                'BRACKET_TABLE',
      isPreTaxDeduction:   false,
      calculationSequence: 30,
    },
  })

  // Bracket 1 is 0% to account for 2,400 Personal Relief
  await prisma.deductionBracket.createMany({
    data: [
      { ruleId: payeRule.id, incomeFrom: 0,     incomeTo: 24000, ratePercentage: 0,  fixedDeduction: 0 },
      { ruleId: payeRule.id, incomeFrom: 24001, incomeTo: 32333, ratePercentage: 25, fixedDeduction: 0 },
      { ruleId: payeRule.id, incomeFrom: 32334, incomeTo: null,  ratePercentage: 30, fixedDeduction: 2083 },
    ],
  })
  console.log('✅ PAYE Brackets created.')

  // 7. Repair existing March 2026 DRAFT salary run
  const draftRun = await prisma.salaryRun.findFirst({
    where: { month: 3, year: 2026, status: 'DRAFT' },
    include: { lines: true },
  })

  if (draftRun) {
    console.log(`🌀 Recalculating Draft Run ID: ${draftRun.id}...`)
    
    let totalGross        = 0
    let totalNet          = 0
    let totalDeductions   = 0
    let totalEmployerCost = 0

    const runDate = new Date(2026, 2, 15) // March 15

    for (const line of draftRun.lines) {
      const calc = await calculateNetSalary(line.staffProfileId, runDate)
      
      const deductionsTotal = calc.deductions
        .filter(d => !d.isEmployerContribution)
        .reduce((s, d) => s + d.amount, 0)

      await prisma.salaryRunLine.update({
        where: { id: line.id },
        data: {
          grossSalary:     calc.grossSalary,
          allowancesTotal: calc.allowancesTotal,
          deductionsTotal,
          netSalary:       calc.netSalary,
          employerCost:    calc.employerCostTotal,
          breakdown:       calc as any,
        },
      })

      totalGross        += calc.grossSalary + calc.allowancesTotal
      totalNet          += calc.netSalary
      totalDeductions   += deductionsTotal
      totalEmployerCost += calc.employerCostTotal
      
      console.log(`   - Repaired: ${calc.userName} | Deduct: ${deductionsTotal.toFixed(2)} | Net: ${calc.netSalary.toFixed(2)}`)
    }

    await prisma.salaryRun.update({
      where: { id: draftRun.id },
      data: {
        totalGross,
        totalNet,
        totalDeductions,
        totalEmployerCost,
      },
    })
    console.log('✅ Salary Run totals updated.')
  }

  console.log('--- PAYROLL BOOTSTRAP COMPLETE ---')
}

main().catch(console.error).finally(() => prisma.$disconnect())
