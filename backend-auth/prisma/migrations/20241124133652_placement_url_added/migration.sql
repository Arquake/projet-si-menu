/*
  Warnings:

  - A unique constraint covering the columns `[placement]` on the table `Projects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `placement` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "placement" INTEGER NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Projects_placement_key" ON "Projects"("placement");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_url_key" ON "Projects"("url");
