import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function createUser(username, email, password) {
    try {
        return await prisma.user.create({
            data: {
                username,
                email,
                password
            }
        })
    }
    catch (_) {
        throw new Error('Could not create user');
    }
}


async function getUserByEmail(email) {
    try {
        return await prisma.user.findUniqueOrThrow({
            where: {
                email,
            }
        })
    }
    catch (_) {
        throw new Error('No user found');
    }
}

export default {
    createUser,
    getUserByEmail
}