/*
  Warnings:

  - You are about to drop the column `current` on the `Initiative` table. All the data in the column will be lost.
  - You are about to drop the column `joinedAt` on the `Join` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Initiative" DROP COLUMN "current";

-- AlterTable
ALTER TABLE "Join" DROP COLUMN "joinedAt";
