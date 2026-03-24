import { readFileSync } from 'fs'
import { join } from 'path'
import { upsertChunk, clearKnowledgeBase } from '../lib/vector-store.js'
import { prisma } from '../lib/prisma.js'

async function main() {
  console.log('🚀 Starting Master Knowledge Base Seeding...')
  // PURGE OLD DATA FIRST
  console.log('🧹 Clearing legacy knowledge chunks...')
  await clearKnowledgeBase()

  const kbPath = join(__dirname, '../modules/support/KB_MASTER.md')
  const content = readFileSync(kbPath, 'utf8')

  // Split by headers or logical sections
  const sections = content.split('\n## ').filter(s => s.trim().length > 0)

  console.log(`Found ${sections.length} major knowledge sections.`)

  for (let i = 0; i < sections.length; i++) {
    const section = (i === 0 ? '' : '## ') + sections[i]!.trim()
    console.log(`Processing section ${i + 1}/${sections.length}...`)
    
    try {
      await upsertChunk('KB_MASTER.md', i, section)
    } catch (err) {
      console.error(`Failed to process section ${i + 1}:`, err)
    }
  }

  const count = await prisma.knowledgeChunk.count()
  console.log(`✅ Seeding complete. Total Knowledge Chunks: ${count}`)
  process.exit(0)
}

main().catch(err => {
  console.error('Fatal Seeding Error:', err)
  process.exit(1)
})
