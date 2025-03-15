import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function createUser(username, password) {
    try {
        return await prisma.users.create({
            data: {
                username,
                password
            }
        })
    }
    catch (_) {
        throw new Error('Could not create user');
    }
}


async function getUserByUsername(username) {
    try {
        return await prisma.users.findUniqueOrThrow({
            where: {
                username,
            }
        })
    }
    catch (_) {
        throw new Error('No user found');
    }
}


async function getUserInfoById(userid) {
    try {
        return await prisma.users.findUniqueOrThrow({
            where: {
                id: userid,
            },
            select: {
                username: true
            }
        })
    }
    catch (_) {
        throw new Error('No user found');
    }
}


async function changeUsername(userid, newUserName) {
    try {
        return await prisma.users.update({
            where: {
                id: userid,
            },
            data: {
                username: newUserName
            }
        })
    }
    catch (_) {
        throw new Error('No user found');
    }
}

async function getPasswordById(userid) {
    try {
        return await prisma.users.findFirstOrThrow({
            where: {
                id: userid,
            },
            select: {
                password: true,
            }
        })
    }
    catch (_) {
        throw new Error('No user found');
    }
}


async function changePassword(userid, newPassword) {
    try {
        return await prisma.users.update({
            where: {
                id: userid,
            },
            data: {
                password: newPassword
            }
        })
    }
    catch (_) {
        throw new Error('No user found');
    }
}

async function deleteAccount(userId) {
    try {
        return await prisma.users.delete({
            where: {
                id: userId,
            }
        })
    }
    catch (_) {
        throw new Error('No user found');
    }
}

export default {
    createUser,
    getUserByUsername,
    getUserInfoById,
    changeUsername,
    getPasswordById,
    changePassword,
    deleteAccount
}