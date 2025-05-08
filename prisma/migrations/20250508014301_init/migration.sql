/*
  Warnings:

  - You are about to alter the column `intervalo` on the `EdadIntervalo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - A unique constraint covering the columns `[intervalo]` on the table `EdadIntervalo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EdadIntervalo" ALTER COLUMN "intervalo" SET DATA TYPE VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "EdadIntervalo_intervalo_key" ON "EdadIntervalo"("intervalo");
