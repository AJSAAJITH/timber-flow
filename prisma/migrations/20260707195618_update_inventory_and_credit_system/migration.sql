/*
  Warnings:

  - A unique constraint covering the columns `[invoiceNumber]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "InventoryLogType" AS ENUM ('STOCK_IN', 'SALE', 'STOCK_TRANSFER', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "invoiceNumber" TEXT;

-- CreateTable
CREATE TABLE "InventoryLog" (
    "id" TEXT NOT NULL,
    "type" "InventoryLogType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" TEXT,
    "branchId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditPaymentLog" (
    "id" TEXT NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "customerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditPaymentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sale_invoiceNumber_key" ON "Sale"("invoiceNumber");

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditPaymentLog" ADD CONSTRAINT "CreditPaymentLog_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditPaymentLog" ADD CONSTRAINT "CreditPaymentLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
