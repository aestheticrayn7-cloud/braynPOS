export class CashProvider {
  async processPayment(amount: number, reference?: string) {
    // Cash payments are always confirmed immediately
    return {
      status: 'CONFIRMED' as const,
      reference: reference ?? `CASH-${Date.now()}`,
      amount,
    }
  }
}

export const cashProvider = new CashProvider()
