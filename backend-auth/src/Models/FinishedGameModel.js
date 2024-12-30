import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createFinishedGame(userId, stage, finished, score, timeSpent, validated) {
    await prisma.finishedgames.create({
        data: {
            userid: userId,
            stage: stage,
            finished: finished,
            score: score,
            timespentseconds: timeSpent,
            completedstages: validated
        }
    })
}



export default {
    createFinishedGame
}