/*
  Warnings:

  - You are about to drop the column `fingerprint` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "fingerprint",
ADD COLUMN     "browserId" TEXT;
