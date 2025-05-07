/*
  Warnings:

  - The values [dasboard] on the enum `roleModule` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "roleModule_new" AS ENUM ('inicio', 'salud_nutricion', 'educacion', 'proteccion_social', 'servicios_basicos', 'desarrollo_economico', 'politica_incluir', 'normas_informes', 'notas_actualidad', 'participacion_ciudadana');
ALTER TABLE "Role" ALTER COLUMN "defaultModule" TYPE "roleModule_new"[] USING ("defaultModule"::text::"roleModule_new"[]);
ALTER TABLE "User" ALTER COLUMN "overriddenModule" TYPE "roleModule_new"[] USING ("overriddenModule"::text::"roleModule_new"[]);
ALTER TYPE "roleModule" RENAME TO "roleModule_old";
ALTER TYPE "roleModule_new" RENAME TO "roleModule";
DROP TYPE "roleModule_old";
COMMIT;
