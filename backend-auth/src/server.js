import express from 'express';
import TokenManager from "./Managers/TokenManagement/TokenManager.js";
import TokenModel from "./Models/TokenModel/TokenModel.js";
import cors from "cors";
import UserManager from "./Managers/UserManager/UserManager.js";
import ProjectsManager from "./Managers/ProjectsManager/ProjectsManager.js";
import ProjectsModel from './Models/ProjectsModel/ProjectsModel.js';
import OngoingModel from './Models/OngoingModel/OngoingModel.js';
import { createServer } from "http";
import { Server } from "socket.io";
import FinishedGameModel from './Models/FinishedGameModel.js';
import argon2 from 'argon2';


const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";
app.use(express.json());
app.use(cors())

const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*',  // Remplacez par l'URL de votre frontend (si différent)
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
    },
  });

const totalProjectNumber = (await ProjectsManager.getAllProjects()).length;

const moveGameNextStage = async (stage, completedStage) => {
    if (completedStage) {
        await updateGameScore(stage);
    }
    if(stage < totalProjectNumber) {
        if(projetQueue[stage+1].current === null) {
            projetQueue[stage+1].current = projetQueue[stage].current
            projetQueue[stage+1].startedat = null
            projetQueue[stage+1].timeout = playerTimeout(stage+1)
            io.to(projetQueue[stage+1].current.id).emit('playerCanStart');
        }
        else {
            projetQueue[stage+1].waiting = [...projetQueue[stage+1].waiting, projetQueue[stage].current]
        }
    }

    if(projetQueue[stage].waiting.length === 0) {
        projetQueue[stage].current = null
        projetQueue[stage].timeout = null
    }
    else {
        projetQueue[stage].current = projetQueue[stage].waiting[0]
        io.to(projetQueue[stage].current.id).emit('playerCanStart');
        projetQueue[stage].waiting = projetQueue[stage].waiting.slice(1)
        projetQueue[stage].timeout = playerTimeout(stage)
    }
    projetQueue[stage].startedat = null
}


// ------------------------------- SOCKET PART -------------------------------


io.on('connection', (socket) => {
    
    socket.on('disconnect', () => {});

    // Join a room
    socket.on('joinRoom', (codeId) => {
        socket.join(codeId);

        if(playerCurrentInAStage(codeId)) {
            io.to(codeId).emit('playerCanStart');
            io.to(codeId).emit('startEtape', getStartDateOrNow(stage));
        }
        
    });
    
    // Leave a room
    socket.on('leaveRoom', (codeId) => {
        socket.leave(codeId);
    });
});

// ------------------------------- CONVENTIONNAL PART -------------------------------


/**
 *    Client authentication and validity api
 */

/**
 * essaie de connecter l'utilisateur avec ses crédentiels
 */
app.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const data = await UserManager.login(username, password);
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
        await TokenModel.invalidateToken(tokenInfo.tokenUid);
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

        let validity = {username: false, password: false}

        if ((/^[\w]{4,32}$/).test(username)) {
            validity = {...validity, username: true}
        }

        if ((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,32}$/).test(password)) {
            validity = {...validity, password: true}
        }

        const allTrue = Object.values(validity).every(Boolean);

        if (allTrue) {
            const info = await UserManager.register(username, password);
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
app.post('/logout', TokenManager.verifyRefreshToken, async (req, res) => {
    try {
        const refreshToken = (req.headers.authorization).split(' ')[1];
        const tokenId = TokenManager.refreshTokenInfo(refreshToken).tokenUid;
        await TokenModel.invalidateToken(tokenId);
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
        const userid = TokenManager.refreshTokenInfo(refreshToken).userUid;
        res.status(200).send({jwt: TokenManager.generateJwt(userid)});
    }
    catch (_) {
        res.status(401).send('Unauthorized');
    }
});




/**
 *     Game api
 */

/**
 *    create a game for the player
 */
app.post('/create-game', TokenManager.verifyJwtToken, async (req,res)=> {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        const tokenInfo = TokenManager.jwtInfo(token);
        const game = await ProjectsManager.createNewGame(tokenInfo.uid, totalProjectNumber)
        res.status(200).send({...await ProjectsManager.getProjectInfo(game.userid), time: game.startedat})
        io.to(game.id).emit('playerCanStart');
    }
    catch(_) {
        res.status(429).send("une partie est déjà en cours")
    }
})

/**
 * send the ongoing player game to the client
 */
app.post('/get-ongoing-player-game', TokenManager.verifyJwtToken, async(req,res) => {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        const tokenInfo = TokenManager.jwtInfo(token);
        let game = await OngoingModel.getOngoingGameByUserId(tokenInfo.uid)

        if (game) {
            const currentTime = new Date();
            const twoHourBefore = new Date(currentTime.getTime() - 7200);

            if (game.startedat <= twoHourBefore) {
                await ProjectsManager.onGoingGameToFinished(game.userid, false, game.score, 7200);
                game = await ProjectsManager.createNewGame(tokenInfo.uid, totalProjectNumber);
            }
        }

        res.status(200).send({...await ProjectsManager.getProjectInfo(tokenInfo.uid), time: game.startedat})

        io.to(game.id).emit('playerCanStart');
    }
    catch(error) {
        console.log(error)
        res.status(400).send()
    }
})

/**
 * send all projects the app knows
 */
app.post('/get-all-projects', TokenManager.verifyJwtToken, async (req,res) => {
    try {
        res.status(200).send(await ProjectsManager.getAllProjects())
    }
    catch(error) {
        res.status(500).send("Internal server error")
    }
})




/**
 *    Other projects api
 */

/**
 * validate that the player has ended his game stage
 * and sends him a need jwt with the next game
 */
app.post('/validate-stage', async (req,res) => {
    try {
        const projectsCredentials = (req.headers.authorization).split(' ');
        const projectId = parseInt(projectsCredentials[1]);
        const pk = projectsCredentials[2];
        const currentGameCode = parseInt(projectsCredentials[3]);

        const completedStage = req.body.completed || false;

        const project = await ProjectsManager.verifyProjectPk(projectId, pk)

        const onGoingGame = await OngoingModel.getOngoingGameByCode(currentGameCode);
        if (project.order != onGoingGame.currentstage) {
            throw new Error('Game is not current');
        }

        onGoingGame.completedstages[onGoingGame.currentstage-1] = completedStage;

        await moveGameNextStage(onGoingGame.currentstage, completedStage);
        if (onGoingGame.currentstage === totalProjectNumber) {
            const finishedGame = await ProjectsManager.onGoingGameToFinished(onGoingGame.userid, true, await OngoingModel.getOngoingScoreByCode(onGoingGame.id), Date.now()-onGoingGame.startedat, onGoingGame.completedstages);
            io.to(onGoingGame.id).emit('endGame', finishedGame.score);
        }
        else {
            await ProjectsManager.setNextGame(onGoingGame.id, onGoingGame.completedstages);
            const nextGame = await ProjectsManager.getProjectInfo(onGoingGame.userid);
            io.to(onGoingGame.id).emit(
                'stageValidation', 
                {
                    name: nextGame.name, 
                    description: nextGame.description, 
                    authors: nextGame.authors, 
                    url: nextGame.url, 
                    placement: nextGame.placement, 
                    gameId: nextGame.gameId, 
                    time: onGoingGame.startedat,
                    order: nextGame.order
                }
            );
            
            if( playerIsCurrentInStage(onGoingGame.id, nextGame.currentstage) ) {
                io.to(onGoingGame.id).emit('playerCanStart');
            }
        }
        res.status(200).send();
    }
    catch(error) {
        res.status(401).send('Invalid credentials');
    }
});

/**
 * Let other apps get the validity of the code
 * if it's valid returns 200 status and start the game
 * otherwise 401 status is returned
 */
app.post('/get-code-validity', async (req,res) => {
    try {
        const projectsCredentials = (req.headers.authorization).split(' ');
        const projectOrder = parseInt(projectsCredentials[1]);
        const pk = projectsCredentials[2];

        await ProjectsManager.verifyProjectPk(projectOrder, pk)

        const code = req.body.code;
        if (!playerIsCurrentInStage(code, projectOrder)) {
            throw new Error('Game is not current');
        }
        await OngoingModel.getOngoingGameByCode(code)
        io.to(code).emit('startEtape', getStartDateOrNow(projectOrder));
        res.status(200).send({})
    }
    catch (error) {
        console.log(error)
        res.status(401).send()
    }
})




/**
 *    Scoreboard api
 */

app.post('/get-top-ever', async (req,res) => {
    try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        res.status(200).send(await FinishedGameModel.getTopFive(oneYearAgo))
    }
    catch(_) {
        res.status(500).send('An error has occured on the server')
    }
})

app.post('/get-top-month', async (req,res) => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        res.status(200).send(await FinishedGameModel.getTopFive(oneMonthAgo))
    }
    catch(_) {
        res.status(500).send('An error has occured on the server')
    }
})

app.post('/get-top-week', async (req,res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        res.status(200).send(await FinishedGameModel.getTopFive(oneWeekAgo))
    }
    catch(_) {
        res.status(500).send('An error has occured on the server')
    }
})

app.post('/personnal-top-ever', TokenManager.verifyJwtToken, async (req,res) => {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        const tokenInfo = TokenManager.jwtInfo(token);

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        res.status(200).send(await FinishedGameModel.getTopOfUser(oneYearAgo, tokenInfo.uid))
    }
    catch(_) {
        res.status(500).send('An error has occured on the server')
    }
})

app.post('/personnal-top-month', TokenManager.verifyJwtToken, async (req,res) => {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        const tokenInfo = TokenManager.jwtInfo(token);
        
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        res.status(200).send(await FinishedGameModel.getTopOfUser(oneMonthAgo, tokenInfo.uid))
    }
    catch(_) {
        res.status(500).send('An error has occured on the server')
    }
})

app.post('/personnal-top-week', TokenManager.verifyJwtToken, async (req,res) => {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        const tokenInfo = TokenManager.jwtInfo(token);
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        res.status(200).send(await FinishedGameModel.getTopOfUser(oneWeekAgo, tokenInfo.uid))
    }
    catch(_) {
        res.status(500).send('An error has occured on the server')
    }
})




/**
 *    User personnal informations api
 */

app.post('/get-personnal-info', TokenManager.verifyJwtToken, async (req,res) => {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        const tokenInfo = TokenManager.jwtInfo(token);

        res.status(200).send(await UserManager.getPersonnalInfo(tokenInfo.uid))
    }
    catch(_) {
        res.status(500).send('An error has occured on the server')
    }
})

app.post('/change-name', TokenManager.verifyJwtToken, async (req,res) => {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        const tokenInfo = TokenManager.jwtInfo(token);

        const newUsername = req.body.username;

        if (newUsername === null) {
            res.status(400).send()
        }
        else {
            await UserManager.changeUsername(tokenInfo.uid, newUsername)
            res.status(200).send()
        }
    }
    catch(_) {
        res.status(500).send('An error has occured on the server')
    }
})

app.post('/change-password', TokenManager.verifyJwtToken, async (req,res) => {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        const tokenInfo = TokenManager.jwtInfo(token);

        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        if (newPassword === null) {
            res.status(400).send()
        }
        else {
            try {
                const user = await UserManager.getPasswordById(tokenInfo.uid)
                if(await argon2.verify(user.password, oldPassword)) {
                    await UserManager.changePassword(tokenInfo.uid, await argon2.hash(newPassword))
                    res.status(200).send()
                }
                else {
                    res.status(401).send()
                }
            }
            catch (_) {
                res.status(401).send()
            }
        }
    }
    catch(_) {
        res.status(500).send('An error has occured on the server')
    }
})

app.post('/delete-account', TokenManager.verifyJwtToken, async (req,res) => {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        const tokenInfo = TokenManager.jwtInfo(token);

        const password = req.body.password;

        if (password === null) {
            res.status(400).send()
        }
        else {
            try {
                const user = await UserManager.getPasswordById(tokenInfo.uid)
                if(await argon2.verify(user.password, password)) {
                    await UserManager.deleteAccount(tokenInfo.uid)
                    res.status(200).send()
                }
                else {
                    res.status(401).send()
                }
            }
            catch (_) {
                res.status(401).send()
            }
        }
    }
    catch(_) {
        res.status(500).send('An error has occured on the server')
    }
})


server.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
