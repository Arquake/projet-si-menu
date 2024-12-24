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

async function getNextGame(currentGameOrder) {
    return await prisma.projects.findUniqueOrThrow({
        where: {
            order: currentGameOrder + 1
        }
    })
}

async function createNewGame(userId, arrayLength) {
    for (let index = 0; index < 5; index++) {
        try {
            return await prisma.ongoingGame.create({
                data: {
                    id: Math.floor(100000 + Math.random() * 900000),
                    currentStage: 1,
                    userId: userId,
                    score: 1000,
                    completedStages: Array(arrayLength).fill(false)
                }
            })
        }
        catch(_){}
    }
    throw new Error("unable to create game");
}

async function addOneStage(gameId, completedStages) {
    await prisma.ongoingGame.update({
        where: {
            id: gameId
        },
        data: {
            currentStage: {
                increment: 1
            },
            completedStages
        }
    })
}


async function getOngoingGameByCode(code) {

    return await prisma.ongoingGame.findUniqueOrThrow({
        where: {
            id: code
        }
    })
}


async function removeOngoingGame(code) {
    await prisma.ongoingGame.delete({
        where: {
            id: code
        }
    })
}

async function getAllOnGoing() {
    return await prisma.ongoingGame.groupBy({
        by: ['currentStage', 'startedAt', 'id', 'score'],
        _min: {
            startedAt: true
        },
        orderBy: {
            _min: {
                startedAt: 'asc'
            }
        },
        
    })
}

export default {
    getOngoingGameByUserId,
    getNextGame,
    createNewGame,
    addOneStage,
    getOngoingGameByCode,
    removeOngoingGame,
    getAllOnGoing
}