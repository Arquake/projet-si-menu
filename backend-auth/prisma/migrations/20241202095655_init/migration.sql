-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUid" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects" (
    "id" SERIAL NOT NULL,
    "placement" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authors" TEXT[],
    "privateKey" TEXT NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OngoingGame" (
    "id" SERIAL NOT NULL,
    "currentStageId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OngoingGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinishedGames" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL,
    "timeSpent" TIMESTAMP(3) NOT NULL,
    "stage" INTEGER NOT NULL,
    "finished" BOOLEAN NOT NULL,

    CONSTRAINT "FinishedGames_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_placement_key" ON "Projects"("placement");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_url_key" ON "Projects"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_name_key" ON "Projects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_privateKey_key" ON "Projects"("privateKey");

-- CreateIndex
CREATE UNIQUE INDEX "OngoingGame_userId_key" ON "OngoingGame"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FinishedGames_userId_key" ON "FinishedGames"("userId");

-- AddForeignKey
ALTER TABLE "OngoingGame" ADD CONSTRAINT "OngoingGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinishedGames" ADD CONSTRAINT "FinishedGames_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
