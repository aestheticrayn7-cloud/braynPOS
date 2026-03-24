import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const triggers: any[] = await prisma.$queryRaw`
    SELECT trigger_name 
    FROM information_schema.triggers 
    WHERE event_object_table = 'stock_movements';
  `
  console.log('Triggers Count:', triggers.length)
  console.log('Triggers:', triggers.map(t => t.trigger_name))

  const firstStaff = await prisma.staffProfile.findFirst()
  console.log('Staff Gross (Type):', firstStaff ? typeof firstStaff.grossSalary : 'N/A')
  console.log('Staff Gross (Val):', firstStaff?.grossSalary)
  
  if (firstStaff) {
    const val = Number(firstStaff.grossSalary)
    console.log('Number(Staff Gross):', val)
    console.log('isNaN(Number(Staff Gross)):', isNaN(val))
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
