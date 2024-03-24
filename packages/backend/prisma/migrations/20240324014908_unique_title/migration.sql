/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Protocol` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Protocol_title_key" ON "Protocol"("title");
