/*
  Warnings:

  - A unique constraint covering the columns `[proposal_id,creator]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address,comment_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creator` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "creator" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "creator" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Protocol" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Protocol_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Comment_proposal_id_creator_key" ON "Comment"("proposal_id", "creator");

-- CreateIndex
CREATE UNIQUE INDEX "Like_address_comment_id_key" ON "Like"("address", "comment_id");
