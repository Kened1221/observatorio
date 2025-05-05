/*
  Warnings:

  - The `defaultModule` column on the `Role` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `overriddenModelu` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "roleModule" AS ENUM ('dasboard', 'cuantos_somos', 'donde_estamos', 'salud_nutricion', 'educacion', 'proteccion_social', 'servicios_basicos', 'desarrollo_economico', 'politica_incluir', 'normas_informes', 'notas_actualidad', 'participacion_ciudadana');

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "defaultModule",
ADD COLUMN     "defaultModule" "roleModule"[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "overriddenModelu",
ADD COLUMN     "overriddenModelu" "roleModule"[];

-- DropEnum
DROP TYPE "RoleModule";
