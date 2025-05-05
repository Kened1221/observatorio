/*
  Warnings:

  - You are about to drop the `_RoleToUser` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `grupo` on table `Module` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RoleModule" AS ENUM ('dasboard', 'cuantos_somos', 'donde_estamos', 'salud_nutricion', 'educacion', 'proteccion_social', 'servicios_basicos', 'desarrollo_economico', 'politica_incluir', 'normas_informes', 'notas_actualidad', 'participacion_ciudadana');

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_B_fkey";

-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "grupo" SET NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "defaultEntities" "RoleModule"[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roleId" TEXT;

-- DropTable
DROP TABLE "_RoleToUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
