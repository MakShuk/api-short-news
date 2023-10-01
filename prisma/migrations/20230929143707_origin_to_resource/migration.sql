/*
  Warnings:

  - You are about to drop the `Origin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `providerId` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Origin_baseURL_key";

-- DropIndex
DROP INDEX "Origin_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Origin";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Resource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "baseURL" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ratio" INTEGER,
    "published" BOOLEAN DEFAULT false,
    "resourceId" INTEGER,
    "imageUrl" TEXT NOT NULL,
    "imagePath" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("content", "id", "imagePath", "imageUrl", "published", "ratio", "title", "updatedAt") SELECT "content", "id", "imagePath", "imageUrl", "published", "ratio", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_title_key" ON "Post"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Resource_name_key" ON "Resource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_baseURL_key" ON "Resource"("baseURL");
