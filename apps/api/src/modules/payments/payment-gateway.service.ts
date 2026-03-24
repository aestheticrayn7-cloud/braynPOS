import { cashProvider } from './providers/cash.provider.js'
import { mobileMoneyProvider } from './providers/mobile-money.provider.js'

interface PaymentRequest {
  method: string
  amount: number
  reference?: string
  phone?: string
}

export class PaymentGatewayService {
  async processPayment(request: PaymentRequest) {
    switch (request.method) {
      case 'CASH':
        return cashProvider.processPayment(request.amount, request.reference)

      case 'MOBILE_MONEY':
        if (!request.phone) {
          throw { statusCode: 400, message: 'Phone number required for mobile money payment' }
        }
        return mobileMoneyProvider.initiatePayment(request.amount, request.phone, request.reference)

      case 'CARD':
        // Card processing stub — integrate with Stripe/PayStack etc.
        return {
          status: 'CONFIRMED' as const,
          reference: request.reference ?? `CARD-${Date.now()}`,
          amount: request.amount,
        }

      case 'BANK_TRANSFER':
        return {
          status: 'PENDING' as const,
          reference: request.reference ?? `BANK-${Date.now()}`,
          amount: request.amount,
        }

      default:
        throw { statusCode: 400, message: `Unsupported payment method: ${request.method}` }
    }
  }
}

export const paymentGatewayService = new PaymentGatewayService()
