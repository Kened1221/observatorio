/*
  Warnings:

  - You are about to drop the column `overriddenEntities` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_RoleModules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RoleModules" DROP CONSTRAINT "_RoleModules_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleModules" DROP CONSTRAINT "_RoleModules_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "overriddenEntities",
ADD COLUMN     "roleId" TEXT;

-- DropTable
DROP TABLE "_RoleModules";

-- DropTable
DROP TABLE "_UserRoles";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
