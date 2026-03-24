// apps/api/scripts/init-pgvector.ts
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

async function main() {
  const sqlPath = join(__dirname, '../prisma/sql/pgvector_setup.sql')
  const sql = readFileSync(sqlPath, 'utf8')
  
  // Split by semicolon for simpler execution if needed, but here we'll try as one block
  // Note: CREATE EXTENSION must often be run solo.
  
  console.log('Enabling pgvector...')
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`)
  
  console.log('Creating knowledge_chunks table...')
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS knowledge_chunks (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      source_file  TEXT NOT NULL,
      chunk_index  INTEGER NOT NULL,
      content      TEXT NOT NULL,
      embedding    vector(1536) NOT NULL,
      content_hash TEXT NOT NULL,
      created_at   TIMESTAMPTZ DEFAULT now()
    );
  `)

  console.log('Creating indexes...')
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
      ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100);
  `)
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS knowledge_chunks_hash_idx
      ON knowledge_chunks (source_file, content_hash);
  `)

  console.log('✅ pgvector and knowledge base initialized.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
