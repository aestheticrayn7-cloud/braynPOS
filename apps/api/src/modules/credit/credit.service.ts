import { prisma } from '../../lib/prisma.js'
import { Prisma } from '@prisma/client'
import { logAction, AUDIT } from '../../lib/audit.js'
import type { TokenPayload } from '../../lib/jwt.js'

export interface RecordRepaymentInput {
  customerId: string
  amount:     number
  method:     'CASH' | 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER'
  reference?: string | null
  notes?:     string | null
}

export async function recordRepayment(
  input: RecordRepaymentInput,
  actor: TokenPayload
): Promise<{
  customerId:              string
  amountPaid:              number
  newOutstanding:          number
  newSuccessfulRepayments: number
  warning?:                string
}> {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUniqueOrThrow({
      where:  { id: input.customerId },
      select: {
        id: true, name: true, outstandingCredit: true,
        creditLimit: true, successfulRepayments: true, channelId: true,
      },
    })

    const outstanding = Number(customer.outstandingCredit)

    if (outstanding <= 0) {
      throw { statusCode: 422, message: `${customer.name} has no outstanding credit balance to repay.` }
    }

    // Cap overpayment — apply only what is owed, surface excess as warning
    let warning: string | undefined
    let amountToApply = input.amount

    if (input.amount > outstanding) {
      amountToApply = outstanding
      warning = `Payment of ${input.amount} exceeds outstanding balance of ${outstanding.toFixed(2)}. Only ${amountToApply.toFixed(2)} was applied.`
    }

    if (!customer.channelId) {
      throw { statusCode: 422, message: `Customer "${customer.name}" has no channel assignment. Cannot record payment.` }
    }

    await tx.customerPayment.create({
      data: {
        customerId: input.customerId,
        channelId:  customer.channelId,
        method:     input.method,
        amount:     new Prisma.Decimal(amountToApply.toFixed(4)),
        reference:  input.reference ?? null,
        notes:      input.notes ?? null,
      },
    })

    const updated = await tx.customer.update({
      where: { id: input.customerId },
      data:  {
        outstandingCredit:    { decrement: amountToApply },
        successfulRepayments: { increment: 1 },
      },
      select: { outstandingCredit: true, successfulRepayments: true },
    })

    return {
      customerId:              input.customerId,
      amountPaid:              amountToApply,
      newOutstanding:          Number(updated.outstandingCredit),
      newSuccessfulRepayments: updated.successfulRepayments,
      ...(warning ? { warning } : {}),
    }
  })
}

export async function getCreditStatus(customerId: string) {
  const customer = await prisma.customer.findUniqueOrThrow({
    where:  { id: customerId },
    select: {
      id: true, name: true, creditLimit: true, outstandingCredit: true,
      successfulRepayments: true, tier: true,
      customerPayments: {
        orderBy: { createdAt: 'desc' },
        take:    10,
        select:  { amount: true, method: true, reference: true, createdAt: true },
      },
      sales: {
        // FIX 13: filter out reversed sales (deletedAt: null) from recent credit sales
        where:   { saleType: 'CREDIT', deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take:    10,
        select:  { receiptNo: true, netAmount: true, createdAt: true, dueDate: true },
      },
    },
  })

  const creditLimit       = Number(customer.creditLimit)
  const outstandingCredit = Number(customer.outstandingCredit)
  const availableCredit   = Math.max(0, creditLimit - outstandingCredit)
  const utilisationPct    = creditLimit > 0 ? (outstandingCredit / creditLimit) * 100 : 0

  return {
    customerId:           customer.id,
    name:                 customer.name,
    tier:                 customer.tier,
    creditLimit,
    outstandingCredit,
    availableCredit,
    utilisationPercent:   Number(utilisationPct.toFixed(2)),
    successfulRepayments: customer.successfulRepayments,
    recentPayments:       customer.customerPayments,
    recentCreditSales:    customer.sales,
  }
}

export async function adjustCreditLimit(
  customerId: string,
  newLimit:   number,
  actor:      TokenPayload
): Promise<{ customerId: string; oldLimit: number; newLimit: number }> {
  if (newLimit < 0) throw { statusCode: 422, message: 'Credit limit cannot be negative' }

  const customer = await prisma.customer.findUniqueOrThrow({
    where:  { id: customerId },
    select: { creditLimit: true, outstandingCredit: true, name: true },
  })

  const oldLimit    = Number(customer.creditLimit)
  const outstanding = Number(customer.outstandingCredit)

  if (newLimit < outstanding) {
    throw {
      statusCode: 422,
      message: `Cannot set credit limit to ${newLimit.toLocaleString()} — `
             + `${customer.name} already owes ${outstanding.toLocaleString()}.`,
    }
  }

  await prisma.customer.update({
    where: { id: customerId },
    data:  { creditLimit: new Prisma.Decimal(newLimit.toFixed(4)) },
  })

  // FIX 8: Remove the `?? 'CREDIT_LIMIT_ADJUST'` fallback — AUDIT.CREDIT_LIMIT_ADJUST
  // is now defined in audit.ts. Fallback strings are dangerous because they
  // silently write uncontrolled values to the audit log if the import breaks.
  logAction({
    action:     AUDIT.CREDIT_LIMIT_ADJUST,
    actorId:    actor.sub,
    actorRole:  actor.role,
    channelId:  actor.channelId ?? undefined,
    targetType: 'customer',
    targetId:   customerId,
    oldValues:  { creditLimit: oldLimit },
    newValues:  { creditLimit: newLimit },
  })

  return { customerId, oldLimit, newLimit }
}
