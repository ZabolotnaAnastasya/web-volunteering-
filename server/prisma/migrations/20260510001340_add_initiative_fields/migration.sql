-- AlterTable
ALTER TABLE "Initiative" ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "desc" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "location" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "needed" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Join" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "initiativeId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Join_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Join_userId_initiativeId_key" ON "Join"("userId", "initiativeId");

-- AddForeignKey
ALTER TABLE "Join" ADD CONSTRAINT "Join_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Join" ADD CONSTRAINT "Join_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "Initiative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
