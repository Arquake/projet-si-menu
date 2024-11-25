import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * get all the current projects available ids
 * @throws TokenNotFoundError If no token matched with the uid given
 */
async function getAllProjectsId() {
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
    try {
        return await prisma.projects.findUniqueOrThrow({
            where: {
                id: projectId
            }
        })
    }
    catch(_) {
        throw Error("query error");
    }
}


async function getProjectByPlacement(placement) {
    return await prisma.projects.findFirstOrThrow({
        where: {
            placement: placement
        }
    })
}


export default {
    getAllProjectsId,
    getProjecyById,
    getProjectByPlacement
}