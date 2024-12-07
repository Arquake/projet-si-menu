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
    for (let index = 0; index < 5; index++) {
        try {
            return await prisma.ongoingGame.create({
                data: {
                    id: Math.floor(100000 + Math.random() * 900000),
                    currentStage: 1,
                    userId: userId
                }
            })
        }
        catch(_){}
    }
    throw new Error("unable to create game");
}

async function addOneStage(userId) {
    return await prisma.ongoingGame.update({
        where: {
            userId: userId
        },
        data: {
            currentStage: {
                increment: 1
            }
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

export default {
    getOngoingGameByUserId,
    getNextGame,
    createNewGame,
    addOneStage,
    getOngoingGameByCode,
    removeOngoingGame
}