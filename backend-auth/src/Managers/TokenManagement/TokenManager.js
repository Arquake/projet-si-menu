import jwt from "jsonwebtoken";
import TokenModel from "../../Models/TokenModel/TokenModel.js";


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "jwt_secret_error";
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY || "refresh_token_error";
const REFRESH_EXPIRATION_TIME = process.env.REFRESH_EXPIRATION_TIME || "30d";
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || "15min";
const APP_JWT = process.env.APP_JWT || "jwt_app_error"
const APP_JWT_EXPIRATION_TIME = process.env.APP_JWT_EXPIRATION_TIME || "30min";

/**
 * generate a jwt with the user uid given
 * @param userUid the user uid linked to the jwt
 * @return the jwt created
 */
function generateJwt(userUid) {
    return jwt.sign({uid: userUid, iat: Date.now()}, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION_TIME });
}

/**
 * generate the refresh token with the given uid and stores it in the db
 * @param userUid the user uid linked to the refresh token
 * @return the refresh token
 */
async function generateRefreshToken(userUid) {
    let tokenUid = '';
    let i = 0;
    tokenUid = await TokenModel.registerToken(userUid);

    return jwt.sign({userUid: userUid, iat: Date.now(), tokenUid: tokenUid}, REFRESH_TOKEN_KEY, { expiresIn: REFRESH_EXPIRATION_TIME });
}


/**
 * take a jwt and return his data
 * @return {*} the jwt data
 */
const verifyRefreshToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    const refreshToken = authHeader.split(' ')[1];

    if (!refreshToken) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        // Verify the token
        let token =  jwt.verify(refreshToken, REFRESH_TOKEN_KEY);
        await TokenModel.verifyTokenExistence(token.tokenUid);
        next();
    } catch (error) {
        return res.status(401).send('Unauthorized: Invalid token');
    }
}


/**
 * take a jwt and return his data
 * @return {*} the jwt data
 */
const verifyJwtToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send('Unauthorized: No token provided');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).send('Unauthorized: No token provided');
        }

        jwtInfo(token)
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).send('Unauthorized: Invalid token '+ error);
    }
}

/**
 * decode the refresh token
 * @param refreshToken the refresh token
 * @return {*} the refresh token information
 * @throws Error if the refresh token is not valid
 */
function refreshTokenInfo(refreshToken) {
    return jwt.verify(refreshToken, REFRESH_TOKEN_KEY);
}

/**
 * decode the jwt
 * @param token the jwt
 * @return {*} the jwt information
 * @throws Error if the jwt is not valid
 */
function jwtInfo(token) {
    return jwt.verify(token, JWT_SECRET_KEY);
}

/**
 * generate a jwt with the user uid given
 * @param userUid the user uid linked to the jwt
 * @return the jwt created
 */
function generateAppJwt(userUid, appId) {
    return jwt.sign({userUid: userUid, appId: appId, iat: Date.now()}, APP_JWT, { expiresIn: APP_JWT_EXPIRATION_TIME });
}

/**
 * decode the jwt
 * @param token the jwt
 * @return {*} the jwt information
 * @throws Error if the jwt is not valid
 */
function appJwtInfo(token) {
    return jwt.verify(token, APP_JWT);
}

const verifyAppJwt = (req,res,next) => {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        appJwtInfo(token)
        next();
    }
    catch(error) {
        res.status(400).send("Invalid data")
    }
}


export default {
    generateJwt,
    generateRefreshToken,
    verifyRefreshToken,
    refreshTokenInfo,
    jwtInfo,
    generateAppJwt,
    appJwtInfo,
    verifyJwtToken,
    verifyAppJwt
};