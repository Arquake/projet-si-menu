/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `Projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `score` to the `OngoingGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OngoingGame" ADD COLUMN     "score" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "order" INTEGER NOT NULL,
ALTER COLUMN "placement" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Projects_order_key" ON "Projects"("order");
