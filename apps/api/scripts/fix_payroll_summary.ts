import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- REPAIRING SALARY RUN TOTALS ---')

  const runs = await prisma.salaryRun.findMany({
    where:   { status: 'DRAFT' },
    include: { lines: true },
  })

  for (const run of runs) {
    let totalGross        = 0
    let totalNet          = 0
    let totalDeductions   = 0
    let totalEmployerCost = 0

    for (const line of run.lines) {
      totalGross        += Number(line.grossSalary) + Number(line.allowancesTotal)
      totalNet          += Number(line.netSalary)
      totalDeductions   += Number(line.deductionsTotal)
      totalEmployerCost += Number(line.employerCost)
    }

    await prisma.salaryRun.update({
      where: { id: run.id },
      data: {
        totalGross,
        totalNet,
        totalDeductions,
        totalEmployerCost,
      },
    })

    console.log(`✅ Repaired Run ID: ${run.id} | New Gross: ${totalGross.toFixed(2)} | New Net: ${totalNet.toFixed(2)}`)
  }

  console.log('--- REPAIR COMPLETE ---')
}

main().catch(console.error).finally(() => prisma.$disconnect())
