import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * get all the current projects available ids
 * @throws TokenNotFoundError If no token matched with the uid given
 */
async function getAllProjects() {
    try {
        return await prisma.projects.findMany()
    }
    catch (_) {
        throw new Error("query error");
    }
}


async function getProjectByOrder(order) {
    return await prisma.projects.findFirstOrThrow({
        where: {
            order: order
        }
    })
}

async function getProjectByStage(projectStage) {
    return await prisma.projects.findFirstOrThrow({
        where: {
            order: projectStage
        }
    })
}


export default {
    getAllProjects,
    getProjectByOrder,
    getProjectByStage
}