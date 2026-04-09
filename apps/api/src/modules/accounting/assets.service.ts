import { prisma } from '../../lib/prisma.js'
import { Prisma } from '@prisma/client'

export class AssetsService {
  async createAsset(data: {
    name: string
    code: string
    category: string
    purchaseDate: string
    purchasePrice: number
    depreciationRate: number
    channelId: string
    notes?: string
  }) {
    return (prisma as any).fixedAsset.create({
      data: {
        ...data,
        purchaseDate: new Date(data.purchaseDate),
        purchasePrice: new Prisma.Decimal(data.purchasePrice),
        depreciationRate: new Prisma.Decimal(data.depreciationRate),
        currentValue: new Prisma.Decimal(data.purchasePrice), // Initial
      }
    })
  }

  async getAssets(channelId: string) {
    const assets = await (prisma as any).fixedAsset.findMany({
      where: { channelId, deletedAt: null },
      orderBy: { createdAt: 'desc' }
    })

    return assets.map((asset: any) => {
      const bookValue = this.calculateBookValue(asset)
      return {
        ...asset,
        bookValue
      }
    })
  }

  private calculateBookValue(asset: any) { // Use any for raw DB rows, cast to FixedAsset in types
    const purchaseDate = new Date(asset.purchaseDate)
    const now = new Date()
    const diffMs = now.getTime() - purchaseDate.getTime()
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25)
    
    if (diffYears <= 0) return Number(asset.purchasePrice)

    const annualDepreciation = Number(asset.purchasePrice) * (Number(asset.depreciationRate) / 100)
    const totalDepreciation = annualDepreciation * diffYears
    
    const value = Number(asset.purchasePrice) - totalDepreciation
    return Math.max(0, value) // Cannot go below zero
  }
}

export const assetsService = new AssetsService()
