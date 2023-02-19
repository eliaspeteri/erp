/*
  Warnings:

  - Added the required column `barcode` to the `Product` table without a default value. This is not possible if the table is not empty.

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
    "barcode" INTEGER NOT NULL
);
INSERT INTO "new_Product" ("depth", "description", "height", "id", "manufacturer", "price", "title", "width") SELECT "depth", "description", "height", "id", "manufacturer", "price", "title", "width" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
