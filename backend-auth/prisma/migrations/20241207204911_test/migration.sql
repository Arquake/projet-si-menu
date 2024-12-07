-- AddForeignKey
ALTER TABLE "FinishedGames" ADD CONSTRAINT "FinishedGames_stage_fkey" FOREIGN KEY ("stage") REFERENCES "Projects"("order") ON DELETE RESTRICT ON UPDATE CASCADE;
