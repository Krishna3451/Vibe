-- AlterTable
ALTER TABLE "Fragment" ADD COLUMN     "sandboxCreatedAt" TIMESTAMP(3),
ADD COLUMN     "sandboxExpiresAt" TIMESTAMP(3),
ADD COLUMN     "sandboxId" TEXT;
