import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const line = await prisma.salaryRunLine.findFirst()
  if (!line) return
  
  console.log('--- LINE VALUES ---')
  console.log('grossSalary:', line.grossSalary, typeof line.grossSalary)
  console.log('netSalary:', line.netSalary, typeof line.netSalary)
  console.log('totalDeductions:', line.deductionsTotal, typeof line.deductionsTotal)
  
  // Simulate what the API returns (JSON serialization)
  const json = JSON.parse(JSON.stringify(line))
  console.log('--- JSON SERIALIZED ---')
  console.log('grossSalary:', json.grossSalary, typeof json.grossSalary)
  console.log('netSalary:', json.netSalary, typeof json.netSalary)
  console.log('deductionsTotal:', json.deductionsTotal, typeof json.deductionsTotal)
}

main().catch(console.error).finally(() => prisma.$disconnect())
