/*
  Warnings:

  - The primary key for the `Avance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Avance` table. All the data in the column will be lost.
  - Added the required column `objetive` to the `Avance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avance" DROP CONSTRAINT "Avance_pkey",
DROP COLUMN "id",
ADD COLUMN     "objetive" TEXT NOT NULL;
