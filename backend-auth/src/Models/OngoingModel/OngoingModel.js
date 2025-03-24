import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * get the project by his ID
 */
async function getOngoingGameByUserId(userId) {
    return await prisma.ongoinggames.findUnique({
        where: {
            userid: userId
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
    try {
        return await prisma.ongoinggames.create({
            data: {
                currentstage: 1,
                userid: userId,
                score: 0,
                completedstages: Array(arrayLength).fill(false)
            }
        })
    }
    catch(_){
        throw new Error("unable to create game");
    }
}

async function addOneStage(gameId, completedstages) {
    await prisma.ongoinggames.update({
        where: {
            id: gameId
        },
        data: {
            currentstage: {
                increment: 1
            },
            completedstages
        }
    })
}


async function getOngoingGameByCode(code) {

    return await prisma.ongoinggames.findUniqueOrThrow({
        where: {
            id: code
        }
    })
}


async function removeOngoingGame(code) {
    await prisma.ongoinggames.delete({
        where: {
            id: code
        }
    })
}

async function getAllOnGoing() {
    return await prisma.ongoinggames.groupBy({
        by: ['currentstage', 'startedat', 'id', 'score'],
        _min: {
            startedat: true
        },
        orderBy: {
            _min: {
                startedat: 'asc'
            }
        },
        
    })
}

async function incrementScoreBy(codeId, scoreToAdd) {
    return await prisma.ongoinggames.update({
        where: {
            id: codeId
        },
        data: {
            score: {
                increment: scoreToAdd
            }
        }
    })
}

async function getOngoingScoreByCode(codeId) {
    return (await prisma.ongoinggames.findUniqueOrThrow({
        where: {
            id: codeId
        },
        select: {
            score: true
        }
    })).score
}

export default {
    getOngoingGameByUserId,
    getNextGame,
    createNewGame,
    addOneStage,
    getOngoingGameByCode,
    removeOngoingGame,
    getAllOnGoing,
    incrementScoreBy,
    getOngoingScoreByCode
}