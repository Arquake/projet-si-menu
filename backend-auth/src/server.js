import express from 'express';
import TokenManager from "./Managers/TokenManagement/TokenManager.js";
import TokenModel from "./Models/TokenModel/TokenModel.js";
import cors from "cors";
import UserManager from "./Managers/UserManager/UserManager.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

/**
 * essaie de connecter l'utilisateur avec ses crédentiels
 */
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const data = await UserManager.login(email, password);
        res.status(200).send(data);
    }
    catch (_) {
        res.status(400).send('Invalid credentials')
    }
});

/**
 * essaies de connecter l'utilisateur avec son refresh token
 */
app.post('/token-login', TokenManager.verifyRefreshToken, async (req, res) => {
    try {
        const refreshToken = (req.headers.authorization).split(' ')[1];
        const tokenInfo = TokenManager.refreshTokenInfo(refreshToken);
        TokenModel.invalidateToken(tokenInfo.tokenUid);
        const newJwt = TokenManager.generateJwt(tokenInfo.userUid);
        const newRefreshToken = await TokenManager.generateRefreshToken(tokenInfo.userUid);
        res.status(200).send(
            {
                jwt: newJwt,
                refreshToken: newRefreshToken
            }
        );
    }
    catch (_) {
        res.status(401).send('Unauthorized');
    }
});

/**
 * créer un nouvel utilisateur et renvoi les informations à l'utilisateur avec un jwt et refresh
 */
app.post('/register', async (req, res) => {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;

        let validity = {username: false, password: false, email: false}

        if ((/^[\w\-\.]+@(?:[\w-]+\.)+[\w-]{2,4}$/).test(email)) {
            validity = {...validity, email: true}
        }

        if ((/^[\w]{4,32}$/).test(username)) {
            validity = {...validity, username: true}
        }

        if ((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,32}$/).test(password)) {
            validity = {...validity, password: true}
        }

        const allTrue = Object.values(validity).every(Boolean);

        if (allTrue) {
            const info = await UserManager.register(username, email, password);
            res.status(200).send(info)
        }
        else {
            res.status(401).send(validity)
        }
        
    }
    catch (_) {
        res.status(400).json('Impossible to create the user');
    }
});

/**
 * take a refresh token from an authorization header and remove it from the db
 * whatever code it returns user have to disconnect
 */
app.post('/logout', TokenManager.verifyRefreshToken, (req, res) => {
    try {
        const refreshToken = (req.headers.authorization).split(' ')[1];
        const tokenId = TokenManager.refreshTokenInfo(refreshToken).tokenUid;
        TokenModel.invalidateToken(tokenId);
        res.status(200).send();
    }
    catch (_) {
        res.status(401).send('Unauthorized');
    }
});

/**
 * return 200 if the jwt is valid
 * 401 otherwise
 */
app.post('/jwt-validation', TokenManager.verifyJwtToken, (req, res) => {
    res.status(200).send()
});

/**
 * return 200 and the new jwt
 * 401 if the refresh token became invalid
 */
app.post('/refresh-jwt', TokenManager.verifyRefreshToken, (req, res) => {
    try {
        const refreshToken = (req.headers.authorization).split(' ')[1];
        const userId = TokenManager.refreshTokenInfo(refreshToken).userUid;
        res.status(200).send({jwt: TokenManager.generateJwt(userId)});
    }
    catch (_) {
        res.status(401).send('Unauthorized');
    }
});


/**
 * take a jwt and the application private key
 * return a 200 if valid and a 401 if the credentials aren't valid
 */
app.post('/get-client-validity', (req,res) => {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        TokenManager.appJwtInfo(token)
        res.status(200).send();
    }
    catch (_) {
        res.status(401).send('Unauthorized');
    }
});


/**
 * take a user id and the application id
 * return a 200 with jwt if valid and a 401 if the credentials aren't valid
 */
app.post('/generate', TokenManager.verifyJwtToken, (req,res) => {
    try {
        const body = req.body;
        const userId = body.userUid;
        const appId = body.appId;
        res.status(200).send({jwt: TokenManager.generateAppJwt(userId, appId)});
    }
    catch (_) {
        res.status(400).send('Unauthorized');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
