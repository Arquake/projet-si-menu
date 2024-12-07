/*
  Warnings:

  - You are about to drop the column `timeSpent` on the `FinishedGames` table. All the data in the column will be lost.
  - Added the required column `score` to the `FinishedGames` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeSpentSeconds` to the `FinishedGames` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FinishedGames" DROP COLUMN "timeSpent",
ADD COLUMN     "score" INTEGER NOT NULL,
ADD COLUMN     "timeSpentSeconds" INTEGER NOT NULL,
ALTER COLUMN "registeredAt" SET DEFAULT CURRENT_TIMESTAMP;
