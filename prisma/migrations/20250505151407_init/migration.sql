/*
  Warnings:

  - You are about to drop the column `overriddenModelu` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "overriddenModelu",
ADD COLUMN     "overriddenModule" "roleModule"[];
