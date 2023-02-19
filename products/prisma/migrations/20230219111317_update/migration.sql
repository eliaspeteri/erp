/*
  Warnings:

  - You are about to alter the column `barcode` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "width" REAL,
    "height" REAL,
    "depth" REAL,
    "barcode" BIGINT NOT NULL
);
INSERT INTO "new_Product" ("barcode", "depth", "description", "height", "id", "manufacturer", "price", "title", "width") SELECT "barcode", "depth", "description", "height", "id", "manufacturer", "price", "title", "width" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
