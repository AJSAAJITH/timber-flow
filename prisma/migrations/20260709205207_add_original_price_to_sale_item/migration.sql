/*
  Warnings:

  - Added the required column `originalPrice` to the `SaleItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleItem" ADD COLUMN     "originalPrice" DECIMAL(10,2) NOT NULL;
