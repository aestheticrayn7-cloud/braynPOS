-- CreateTable
CREATE TABLE "knowledge_chunks" (
    "id" TEXT NOT NULL,
    "sourceFile" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" JSONB NOT NULL,
    "contentHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_chunks_sourceFile_contentHash_key" ON "knowledge_chunks"("sourceFile", "contentHash");
