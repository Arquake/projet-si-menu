-- AlterTable
ALTER TABLE "FinishedGames" ADD COLUMN     "completedStages" BOOLEAN[];

-- AlterTable
ALTER TABLE "OngoingGame" ADD COLUMN     "completedStages" BOOLEAN[];
