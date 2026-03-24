import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const line = await prisma.salaryRunLine.findFirst({
    include: { staffProfile: true }
  })
  if (!line) {
    console.log('No SalaryRunLine found')
    return
  }
  console.log('Line ID:', line.id)
  console.log('Gross Salary (Field):', line.grossSalary)
  console.log('Type of Gross Salary:', typeof line.grossSalary)
  console.log('Breakdown Gross:', (line.breakdown as any)?.grossSalary)
  console.log('Staff Profile Gross:', line.staffProfile.grossSalary)
}

main().catch(console.error).finally(() => prisma.$disconnect())
