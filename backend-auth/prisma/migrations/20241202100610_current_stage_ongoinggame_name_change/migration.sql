/*
  Warnings:

  - You are about to drop the column `currentStageId` on the `OngoingGame` table. All the data in the column will be lost.
  - Added the required column `currentStage` to the `OngoingGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OngoingGame" DROP COLUMN "currentStageId",
ADD COLUMN     "currentStage" INTEGER NOT NULL;
