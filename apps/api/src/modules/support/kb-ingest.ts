// apps/api/src/modules/support/kb-ingest.ts
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { upsertChunk } from '../../lib/vector-store.js'

const KB_DIR = join(__dirname, '../../support-kb')

async function ingest() {
  const files = (await readdir(KB_DIR)).filter(f => f.endsWith('.md'))
  for (const file of files) {
    const content = await readFile(join(KB_DIR, file), 'utf8')
    const chunks = content.split('\n\n').filter(c => c.length > 20)
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      if (chunk) await upsertChunk(file, i, chunk)
    }
    console.log(`Indexed ${file}`)
  }
}

ingest().catch(console.error)
