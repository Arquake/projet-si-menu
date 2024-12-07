import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createFinishedGame(userId, stage, finished, score, timeSpent) {
    await prisma.finishedGames.create({
        data: {
            userId: userId,
            stage: stage,
            finished: finished,
            score: score,
            timeSpentSeconds: timeSpent
        }
    })
}



export default {
    createFinishedGame
}