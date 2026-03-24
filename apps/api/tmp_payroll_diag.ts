import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const result: any = {}

  // 1. Check deduction rules
  result.rules = await prisma.$queryRaw`
    SELECT
      id, name, type, rate, "isActive",
      "appliesToJobLevelId", "channelId",
      "calculationSequence", "isPreTaxDeduction"
    FROM deduction_rules
    ORDER BY "calculationSequence";
  `

  // 2. Check staff profiles and their job levels
  result.staff = await prisma.$queryRaw`
    SELECT
      sp.id, u.username, sp."grossSalary",
      sp."jobTitle", sp."jobLevelId"
    FROM staff_profiles sp
    JOIN users u ON u.id = sp."userId";
  `

  fs.writeFileSync('c:\\Users\\HP\\Desktop\\braynPOS\\apps\\api\\diag_payroll_output.json', JSON.stringify(result, null, 2))
  console.log('✅ Diagnostic results written to diag_payroll_output.json')
}

main().catch(console.error).finally(() => prisma.$disconnect())
