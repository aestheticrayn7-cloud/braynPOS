import argon2 from 'argon2'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
  const users = await prisma.user.findMany()
  console.log('Users:', users.map((u: any) => ({ email: u.email, isActive: u.isActive, deletedAt: u.deletedAt })))
}

test()
