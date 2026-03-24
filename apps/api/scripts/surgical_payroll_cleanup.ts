import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- SURGICAL PAYROLL CLEANUP ---')

  const runs = await prisma.salaryRun.findMany({
    where: { month: 3, year: 2026 }
  })

  if (runs.length === 0) {
    console.log('No March 2026 runs found.')
    return
  }

  const runIds = runs.map(r => r.id)

  await prisma.$transaction(async (tx) => {
    // 1. Revert Commission Entries associated with these payouts
    const payouts = await tx.commissionPayout.findMany({
      where: { salaryRunId: { in: runIds } }
    })
    
    if (payouts.length > 0) {
       const payoutIds = payouts.map(p => p.id)
       // We don't have a direct status update for entries via payoutId in the DB yet?
       // Let's find entries for the users in those months.
       for (const run of runs) {
         const periodStart = new Date(run.year, run.month - 1, 1)
         const periodEnd   = new Date(run.year, run.month, 0, 23, 59, 59)
         await tx.commissionEntry.updateMany({
           where: {
             status: 'APPROVED',
             createdAt: { gte: periodStart, lte: periodEnd }
           },
           data: { status: 'PENDING' }
         })
       }
       console.log('✅ Reverted commission entries to PENDING')
       
       await tx.commissionPayout.deleteMany({ where: { id: { in: payoutIds } } })
       console.log(`✅ Deleted ${payoutIds.length} Commission Payouts`)
    }

    // 2. Delete Accounting Data
    const journals = await tx.journalEntry.findMany({
      where: { referenceId: { startsWith: 'PAYROLL/' } } // Standard prefix used in buildPayrollJournalEntry
    })
    
    if (journals.length > 0) {
      const journalIds = journals.map(j => j.id)
      await tx.ledger.deleteMany({ where: { journalId: { in: journalIds } } })
      await tx.journalEntry.deleteMany({ where: { id: { in: journalIds } } })
      console.log(`✅ Deleted ${journalIds.length} Payroll Journal Entries and Ledger records`)
    }

    // 3. Delete Salary Run Data
    const linesDeleted = await tx.salaryRunLine.deleteMany({ where: { salaryRunId: { in: runIds } } })
    const runsDeleted = await tx.salaryRun.deleteMany({ where: { id: { in: runIds } } })
    
    console.log(`✅ Deleted ${linesDeleted.count} Salary Run Lines and ${runsDeleted.count} Salary Runs`)
  })

  console.log('--- CLEANUP COMPLETE ---')
}

main().catch(console.error).finally(() => prisma.$disconnect())
