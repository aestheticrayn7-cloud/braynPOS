import { prisma } from '../../lib/prisma.js'
import { searchKnowledge } from '../../lib/vector-store.js'

/**
 * KB Gap Detector
 * Analyzes staff feedback and support tickets to identify missing or weak documentation.
 */
export async function logKBGap(query: string, ticketId: string, reason: 'LOW_SIMILARITY' | 'STAFF_FEEDBACK') {
  console.log(`[KBGapDetector] Gap identified: "${query}" (Reason: ${reason})`)
  
  await prisma.notification.create({
    data: {
      type: 'SYSTEM',
      message: `📌 **KB GAP DETECTED:** Documentation may be missing for: "${query}". (Reason: ${reason}, Ticket: ${ticketId})`,
    }
  })
}

/**
 * Checks if a user's query has sufficient documentation coverage.
 */
export async function checkCoverage(query: string): Promise<boolean> {
  const results = await searchKnowledge(query, 1) as any[]
  return results.length > 0 && results[0].similarity > 0.45
}
