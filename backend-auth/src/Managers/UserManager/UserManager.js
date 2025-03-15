import argon2 from 'argon2';
import UserModel from "../../Models/UserModel/UserModel.js";
import TokenManager from "../TokenManagement/TokenManager.js";

/**
 * take the username and password and verify if they match then it returns the user infos
 * @param username
 * @param password
 */
async function login(username, password) {
    let user = await UserModel.getUserByUsername(username);
    if(!await argon2.verify(user.password, password)){throw new Error('Invalid password')}
    const newJwt = TokenManager.generateJwt(user.id);
    const newRefreshtoken = await TokenManager.generateRefreshToken(user.id);
    return {username: user.username, jwt: newJwt, refreshToken: newRefreshtoken}
}

/**
 * create the user and give back the jwt and refresh token for the user
 * @param username the username of the user
 * @param password the password of the user
 * @return {Promise<{jwt: (*), refreshToken: (*)}>} The jwt and refresh token of the user
 */
async function register(username, password) {
    try {
        let hashedPassword = await argon2.hash(password);
        let newUser = await UserModel.createUser(username, hashedPassword);
        let refreshToken = await TokenManager.generateRefreshToken(newUser.id);
        let jwt = TokenManager.generateJwt(newUser.id);
        return {refreshToken: refreshToken, jwt: jwt};
    }
    catch (_) {
        throw new Error('Could not create the user');
    }
}


async function getPersonnalInfo(userId) {
    return await UserModel.getUserInfoById(userId);
}

async function changeUsername(userId, username) {
    await UserModel.changeUsername(userId, username)
}

async function getPasswordById(userId) {
    return await UserModel.getPasswordById(userId)
}

async function changePassword(userId, newPassword) {
    await UserModel.changePassword(userId, newPassword)
}

async function deleteAccount(userId) {
    await UserModel.deleteAccount(userId)
}


export default {
    login,
    register,
    getPersonnalInfo,
    changeUsername,
    getPasswordById,
    changePassword,
    deleteAccount
}