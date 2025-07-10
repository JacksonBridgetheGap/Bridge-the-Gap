/*
  Warnings:

  - Added the required column `promptLastUpdate` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "promptLastUpdate" TIMESTAMP(3) NOT NULL;
