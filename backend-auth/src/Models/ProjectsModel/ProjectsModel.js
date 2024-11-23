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


export default {
    getAllProjectsId
}