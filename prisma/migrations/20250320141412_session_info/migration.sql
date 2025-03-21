-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "deviceInfo" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
