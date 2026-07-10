/*
  Warnings:

  - The values [SALE,STOCK_TRANSFER] on the enum `InventoryLogType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `type` on the `InventoryLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InventoryLogType_new" AS ENUM ('STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT', 'DAMAGE', 'RETURN');
ALTER TABLE "InventoryLog" ALTER COLUMN "type" TYPE "InventoryLogType_new" USING ("type"::text::"InventoryLogType_new");
ALTER TYPE "InventoryLogType" RENAME TO "InventoryLogType_old";
ALTER TYPE "InventoryLogType_new" RENAME TO "InventoryLogType";
DROP TYPE "public"."InventoryLogType_old";
COMMIT;

-- AlterTable
ALTER TABLE "InventoryLog" DROP COLUMN "type",
ADD COLUMN     "type" "InventoryLogType" NOT NULL;
