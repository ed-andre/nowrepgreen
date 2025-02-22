-- CreateTable
CREATE TABLE "MediaTagsJson" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "MediaTagsJson_createdAt_idx" ON "MediaTagsJson"("createdAt");
