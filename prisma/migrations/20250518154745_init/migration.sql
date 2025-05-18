/*
  Warnings:

  - A unique constraint covering the columns `[objetive,distritoId,operation]` on the table `Avance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Avance_distritoId_operation_key";

-- CreateIndex
CREATE UNIQUE INDEX "Avance_objetive_distritoId_operation_key" ON "Avance"("objetive", "distritoId", "operation");
