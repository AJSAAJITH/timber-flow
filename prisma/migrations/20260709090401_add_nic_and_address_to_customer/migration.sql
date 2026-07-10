/*
  Warnings:

  - A unique constraint covering the columns `[nic]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "address" TEXT,
ADD COLUMN     "nic" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_nic_key" ON "Customer"("nic");
