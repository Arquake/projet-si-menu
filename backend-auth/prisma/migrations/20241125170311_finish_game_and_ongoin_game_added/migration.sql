-- CreateTable
CREATE TABLE "OngoingGame" (
    "id" SERIAL NOT NULL,
    "currentStage" INTEGER NOT NULL,
    "currentTime" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OngoingGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinishedGames" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL,
    "timeSpent" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinishedGames_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OngoingGame_userId_key" ON "OngoingGame"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FinishedGames_userId_key" ON "FinishedGames"("userId");

-- AddForeignKey
ALTER TABLE "OngoingGame" ADD CONSTRAINT "OngoingGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinishedGames" ADD CONSTRAINT "FinishedGames_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
