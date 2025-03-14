/*
  Warnings:

  - The primary key for the `Distrito` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Edad` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Nacionalidad` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pais` on the `Nacionalidad` table. All the data in the column will be lost.
  - The primary key for the `Sexo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TipoPoblacion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Encuesta` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `Distrito` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rango]` on the table `Edad` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Nacionalidad` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[genero]` on the table `Sexo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tipo]` on the table `TipoPoblacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nombre` to the `Nacionalidad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Distrito" DROP CONSTRAINT "Distrito_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Distrito_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Distrito_id_seq";

-- AlterTable
ALTER TABLE "Edad" DROP CONSTRAINT "Edad_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Edad_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Edad_id_seq";

-- AlterTable
ALTER TABLE "Nacionalidad" DROP CONSTRAINT "Nacionalidad_pkey",
DROP COLUMN "pais",
ADD COLUMN     "nombre" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Nacionalidad_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Nacionalidad_id_seq";

-- AlterTable
ALTER TABLE "Sexo" DROP CONSTRAINT "Sexo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Sexo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Sexo_id_seq";

-- AlterTable
ALTER TABLE "TipoPoblacion" DROP CONSTRAINT "TipoPoblacion_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TipoPoblacion_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TipoPoblacion_id_seq";

-- DropTable
DROP TABLE "Encuesta";

-- CreateTable
CREATE TABLE "TotalEncuestados" (
    "id" TEXT NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "TotalEncuestados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Distrito_nombre_key" ON "Distrito"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Edad_rango_key" ON "Edad"("rango");

-- CreateIndex
CREATE UNIQUE INDEX "Nacionalidad_nombre_key" ON "Nacionalidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Sexo_genero_key" ON "Sexo"("genero");

-- CreateIndex
CREATE UNIQUE INDEX "TipoPoblacion_tipo_key" ON "TipoPoblacion"("tipo");
