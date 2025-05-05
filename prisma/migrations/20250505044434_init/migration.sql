/*
  Warnings:

  - You are about to drop the column `defaultEntities` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "defaultEntities",
ADD COLUMN     "defaultModule" "RoleModule"[];
