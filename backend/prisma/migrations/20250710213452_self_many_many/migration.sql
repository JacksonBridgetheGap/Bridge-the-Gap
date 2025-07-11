/*
  Warnings:

  - You are about to drop the column `circle` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "circle";

-- CreateTable
CREATE TABLE "_UserCircle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserCircle_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserCircle_B_index" ON "_UserCircle"("B");

-- AddForeignKey
ALTER TABLE "_UserCircle" ADD CONSTRAINT "_UserCircle_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCircle" ADD CONSTRAINT "_UserCircle_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
