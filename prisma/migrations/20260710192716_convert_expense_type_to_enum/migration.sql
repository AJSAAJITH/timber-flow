/*
  Warnings:

  - The `type` column on the `Expense` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('GENERAL', 'PROFIT_WITHDRAWAL', 'SALARY', 'PETTY_CASH', 'BILL_PAYMENT');

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "type",
ADD COLUMN     "type" "ExpenseType" NOT NULL DEFAULT 'GENERAL';
