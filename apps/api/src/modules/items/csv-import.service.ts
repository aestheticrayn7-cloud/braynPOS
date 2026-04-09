import { parse } from 'csv-parse'
import { Readable } from 'stream'
import { prisma } from '../../lib/prisma.js'

interface CsvItemRow {
  sku: string
  name: string
  barcode?: string
  description?: string
  retailPrice: string
  wholesalePrice: string
  minRetailPrice: string
  weightedAvgCost?: string
  unitOfMeasure?: string
  reorderLevel?: string
  isSerialized?: string
  taxClass?: string
  categoryName?: string
  brandName?: string
  supplierName?: string
}

export class CsvImportService {
  async importItems(csvBuffer: Buffer) {
    const records: CsvItemRow[] = []
    const errors: { row: number; error: string }[] = []
    let created = 0
    let updated = 0

    // Parse CSV
    const parser = Readable.from(csvBuffer).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })
    )

    for await (const row of parser) {
      records.push(row as CsvItemRow)
    }

    // Process each row
    for (let i = 0; i < records.length; i++) {
      const row = records[i]!
      try {
        // Resolve category by name
        let categoryId: string | undefined
        if (row.categoryName) {
          const cat = await prisma.category.findFirst({
            where: { name: row.categoryName, deletedAt: null },
          })
          if (cat) categoryId = cat.id
        }

        // Resolve brand by name
        let brandId: string | undefined
        if (row.brandName) {
          const brand = await prisma.brand.findFirst({
            where: { name: row.brandName, deletedAt: null },
          })
          if (brand) brandId = brand.id
        }

        // Resolve supplier by name
        let supplierId: string | undefined
        if (row.supplierName) {
          const supplier = await prisma.supplier.findFirst({
            where: { name: row.supplierName, deletedAt: null },
          })
          if (supplier) supplierId = supplier.id
        }

        // Upsert item by SKU
        const existing = await prisma.item.findFirst({
          where: { sku: row.sku, deletedAt: null },
        })

        const itemData = {
          name: row.name,
          barcode: row.barcode || null,
          description: row.description || null,
          retailPrice: parseFloat(row.retailPrice),
          wholesalePrice: parseFloat(row.wholesalePrice),
          minRetailPrice: parseFloat(row.minRetailPrice),
          weightedAvgCost: row.weightedAvgCost ? parseFloat(row.weightedAvgCost) : 0,
          unitOfMeasure: row.unitOfMeasure || 'PCS',
          reorderLevel: row.reorderLevel ? parseInt(row.reorderLevel, 10) : 10,
          isSerialized: row.isSerialized?.toLowerCase() === 'true',
          taxClass: (row.taxClass as 'STANDARD' | 'ZERO_RATED' | 'EXEMPT') || 'STANDARD',
          categoryId: categoryId ?? null,
          brandId: brandId ?? null,
          supplierId: supplierId ?? null,
        }

        if (itemData.weightedAvgCost <= 0) {
          throw new Error('Import Refused: A valid Cost Price is mandatory for every item to ensure margin integrity.')
        }

        if (existing) {
          await prisma.item.update({
            where: { id: existing.id },
            data: itemData,
          })
          updated++
        } else {
          await prisma.item.create({
            data: { sku: row.sku, ...itemData },
          })
          created++
        }
      } catch (err) {
        errors.push({
          row: i + 2, // 1-indexed + header row
          error: (err as Error).message,
        })
      }
    }

    return {
      total: records.length,
      created,
      updated,
      errors,
    }
  }
}

export const csvImportService = new CsvImportService()
