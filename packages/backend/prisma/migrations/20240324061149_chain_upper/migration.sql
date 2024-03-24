/*
  Warnings:

  - The `chain` column on the `Protocol` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CHAIN" AS ENUM ('NEAR', 'SCROLL');

-- AlterTable
ALTER TABLE "Protocol" DROP COLUMN "chain",
ADD COLUMN     "chain" "CHAIN" NOT NULL DEFAULT 'NEAR';

-- DropEnum
DROP TYPE "Chain";
