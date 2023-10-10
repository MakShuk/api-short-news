/*
  Warnings:

  - Added the required column `originalTitle` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalUrl` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ratio" INTEGER,
    "published" BOOLEAN DEFAULT false,
    "resourceId" INTEGER,
    "imageUrl" TEXT NOT NULL,
    "imagePath" TEXT,
    "originalUrl" TEXT NOT NULL,
    "summaryUrl" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("content", "id", "imagePath", "imageUrl", "published", "ratio", "resourceId", "title", "updatedAt") SELECT "content", "id", "imagePath", "imageUrl", "published", "ratio", "resourceId", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_originalUrl_key" ON "Post"("originalUrl");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
