/*
  Warnings:

  - You are about to drop the column `attemts` on the `VerificationCode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VerificationCode" DROP COLUMN "attemts",
ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 3,
ALTER COLUMN "code" SET DATA TYPE TEXT;
