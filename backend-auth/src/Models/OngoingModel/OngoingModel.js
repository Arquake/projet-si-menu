import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * get the project by his ID
 */
async function getOngoingGameByUserId(userId) {
    return await prisma.ongoingGame.findUniqueOrThrow({
        where: {
            userId: userId
        }
    })
}

async function getNextGame(currentGamePlacement) {
    return await prisma.projects.findUniqueOrThrow({
        where: {
            id: currentGamePlacement + 1
        }
    })
}

async function createNewGame(userId) {
    await prisma.ongoingGame.create({
        data: {
            currentStage: 1,
            userId: userId
        }
    })
}

export default {
    getOngoingGameByUserId,
    getNextGame,
    createNewGame
}