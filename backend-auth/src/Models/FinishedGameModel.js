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

/**
 * Récupère les 5 meilleurs scores après la date
 * @param {*} date la date après laquelle il faut chercher
 * @returns le top 5 des meilleurs parties avec le pseudo des joueurs, leur temps, leur score
 */
async function getTopFive(date) {
    return (await prisma.finishedgames.findMany({
        where: {
            registeredat: {
                gt: date,
            },
            finished: true
        },
        distinct: ['userid'],
        select: {
            score: true,
            timespentseconds: true,
            users: {
                select: {
                    username: true,
                },
            },
        },
        orderBy: [
            { score: 'desc' },
            { timespentseconds: 'asc' }
        ],
        take: 5,
    })).map(game => ({
        username: game.users.username,
        score: game.score,
        time: game.timespentseconds,
    }));
}



export default {
    createFinishedGame,
    getTopFive
}