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

/**
 * get the project by his ID
 */
async function getProjecyById(projectId) {
    return await prisma.projects.findUniqueOrThrow({
        where: {
            id: projectId
        }
    })
}


async function getProjectByOrder(order) {
    return await prisma.projects.findFirstOrThrow({
        where: {
            order: order
        }
    })
}


export default {
    getAllProjects,
    getProjecyById,
    getProjectByOrder
}