import { prisma } from './prisma.js'
import { createHash } from 'crypto'
import { embedText as geminiEmbed } from './gemini-client.js'

/**
 * Generates an embedding for a text string using Google Gemini.
 */
export async function embedText(text: string): Promise<number[]> {
  try {
    return await geminiEmbed(text.replace(/\n/g, ' ').trim())
  } catch (err) {
    console.warn('Gemini embedding failed, falling back to zeros:', err)
    return new Array(768).fill(0) // Note: Gemini 004 is 768d, verify if this matches existing schema/usage
  }
}

/**
 * Similarity search via in-app Cosine Similarity.
 */
export async function searchKnowledge(query: string, topK: number = 5) {
  const queryEmbedding = await embedText(query)
  const chunks = await prisma.knowledgeChunk.findMany()
  
  const results = chunks.map((chunk: any) => {
    const chunkEmbedding = chunk.embedding as number[]
    if (!chunkEmbedding || !Array.isArray(chunkEmbedding)) return null
    return {
      content: chunk.content as string,
      sourceFile: chunk.sourceFile as string,
      similarity: cosineSimilarity(queryEmbedding, chunkEmbedding)
    }
  }).filter((r): r is any => r !== null)

  return results
    .sort((a, b) => b.similarity - a.similarity)
    .filter(r => r.similarity > 0.35)
    .slice(0, topK)
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0
  let dotProduct = 0, mA = 0, mB = 0
  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i]!
    const b = vecB[i]!
    dotProduct += a * b
    mA += a * a
    mB += b * b
  }
  const den = Math.sqrt(mA) * Math.sqrt(mB)
  return den === 0 ? 0 : dotProduct / den
}

/**
 * Purges the entire knowledge base table.
 */
export async function clearKnowledgeBase() {
  await prisma.knowledgeChunk.deleteMany({})
}

/**
 * Upserts a knowledge chunk.
 */
export async function upsertChunk(sourceFile: string, chunkIndex: number, content: string) {
  const hash = createHash('sha256').update(content).digest('hex')
  const existing = await prisma.knowledgeChunk.findFirst({ where: { sourceFile, contentHash: hash } })
  if (existing) return
  const embedding = await embedText(content)
  await prisma.knowledgeChunk.create({
    data: { sourceFile, chunkIndex, content, embedding: embedding as any, contentHash: hash }
  })
}
