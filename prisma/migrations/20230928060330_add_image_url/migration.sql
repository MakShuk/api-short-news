/*
  Warnings:

  - Made the column `imageUrl` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ratio" INTEGER,
    "published" BOOLEAN DEFAULT false,
    "providerId" INTEGER,
    "imageUrl" TEXT NOT NULL,
    "imagePath" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("content", "id", "imagePath", "imageUrl", "providerId", "published", "ratio", "title", "updatedAt") SELECT "content", "id", "imagePath", "imageUrl", "providerId", "published", "ratio", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_title_key" ON "Post"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
