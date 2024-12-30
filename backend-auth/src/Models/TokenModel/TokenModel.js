import { PrismaClient } from '@prisma/client';
import TokenNotFoundError from './TokenErrors/TokenNotFoundError.js'
import TokenUidAlreadyTakenError from './TokenErrors/TokenUidAlreadyTakenError.js'

const prisma = new PrismaClient();

/**
 * try to get the token by searching it with the given uid
 * @param tokenUid the token uid
 * @throws TokenNotFoundError If no token matched with the uid given
 */
async function verifyTokenExistence(tokenUid) {
    try {
        await prisma.tokens.findUniqueOrThrow({
            where: {
                id: tokenUid,
            }
        })
    }
    catch (_) {
        throw new TokenNotFoundError();
    }
}

/**
 * register a token inside the db and return the string uid
 * @return the token id
 * @throws TokenUidAlreadyTakenError if the token already exist
 */
async function registerToken(userUid) {
    try {
        return (await prisma.tokens.create({
            data: {
                useruid: userUid,
            }
        })).id;
    }
    catch (_) {
        throw new TokenUidAlreadyTakenError();
    }
}

/**
 * delete the uuid given from the database
 * @param tokenUid the token uid to be deleted
 */
async function invalidateToken(tokenUid) {
    await prisma.tokens.delete({
        where: {
            id: tokenUid
        }
    })
}

export default {
    registerToken,
    verifyTokenExistence,
    invalidateToken,
}