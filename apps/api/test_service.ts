import { PrismaClient } from '@prisma/client'
import { ItemsService } from './src/modules/items/items.service'
import * as fs from 'fs'

const prisma = new PrismaClient()
const itemsService = new (ItemsService as any)()
// Need to mock the prisma instance inside itemsService if it uses the global one
// Actually items.service.ts uses: import { prisma } from '../../lib/prisma'

async function test() {
  const channelId = '4178970e-8042-4796-a6af-da7c8e85d5ba'
  const res = await itemsService.findAll({ channelId }, 'MANAGER')
  fs.writeFileSync('findall_service_out.txt', JSON.stringify(res, null, 2))
}

test().catch(console.error).finally(() => prisma.$disconnect())
