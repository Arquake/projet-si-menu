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


const app = express();
const PORT = process.env.PORT || 3000;
const TIMEOUT_INTERVAL = process.env.TIMEOUT_INTERVAL || 15*60*1000
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


const allOnGoing = await OngoingModel.getAllOnGoing()

const projetQueue = (await ProjectsModel.getAllProjects()).reduce((acc, element) => {
    acc[element.order] = { id: element.id, current: null, waiting: [], startedat: null, timeout: null };
    return acc;
}, {});

allOnGoing.forEach( game => {
    if (projetQueue[game.currentstage].current === null) {
        projetQueue[game.currentstage].current = {id: game.id, score: game.score};
        projetQueue[game.currentstage].timeout = playerTimeout(game.currentstage);
    }
    else {
        projetQueue[game.currentstage].waiting = [...projetQueue[game.currentstage].waiting, {id: game.id, score: game.score}];
    }
})

const totalProjectNumber = Object.keys(projetQueue).length;

function playerTimeout(stage) {
    return (
        setTimeout(async ()=> {
            try {
                const onGoingGame = await OngoingModel.getOngoingGameByCode(projetQueue[stage].current.id);
                ProjectsManager.onGoingGameToFinished(onGoingGame.userid, false, onGoingGame.score, Date.now()-onGoingGame.startedat, onGoingGame.completedstages);
                io.to(projetQueue[stage].current.id).emit('timeout');
                projetQueue[stage].startedat = null;
    
                if(projetQueue[stage].waiting.length === 0) {
                    projetQueue[stage].current = null
                }
                else {
                    projetQueue[stage].current = projetQueue[stage].waiting[0]
                    io.to(projetQueue[stage].current.id).emit('playerCanStart');
                    projetQueue[stage].waiting = projetQueue[stage].waiting.slice(1)
                    projetQueue[stage].timeout = playerTimeout(stage)
                }
            }
            catch (_) {
                
            }
        }, TIMEOUT_INTERVAL)
    )
}

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

const addPlayerToQueue = (gameId) => {
    if (projetQueue[1].current === null) {
        projetQueue[1].current = {id: gameId, score: 0};
        projetQueue[1].startedat = null
        projetQueue[1].timeout = playerTimeout(1)
    }
    else {
        projetQueue[1].waiting = [...projetQueue[1].waiting, {id: gameId, score: 0}];
    }
}

const playerIsCurrentInStage = (gameId, stage) => {
    return projetQueue[stage].current.id === gameId
}

const playerCurrentInAStage = (codeId) => {
    return Object.values(projetQueue).some(stage => stage.current && stage.current.id === codeId);
}

const getStartDateOrNow = (stage) => {
    if (projetQueue[stage].startedat === null) {
        projetQueue[stage].startedat = Date.now();
        clearTimeout(projetQueue[stage].timeout);
    }
    return projetQueue[stage].startedat;
}

const getStageByCurrent = (codeId) => {
    for (let i = 1; i <= totalProjectNumber; i += 1) {
        if(projetQueue[i].current !== null && projetQueue[i].current.id === codeId) {
            return i;
        };
    };
    return null;
}

const updateGameScore = async (stage) => {
    if(projetQueue[stage] !== null) {
        const endTime = new Date((projetQueue[stage].startedat) + 5*60*1000)
        const game = await OngoingModel.incrementScoreBy(projetQueue[stage].current.id, Math.max(
            Math.floor((endTime - new Date())/1000), 0
        )*10);
        projetQueue[stage].current.score = game.score;
    }
}


// ------------------------------- SOCKET PART -------------------------------


io.on('connection', (socket) => {
    
    socket.on('disconnect', () => {});

    // Join a room
    socket.on('joinRoom', (codeId) => {
        console.log(codeId + ' joined')
        socket.join(codeId);

        if(playerCurrentInAStage(codeId)) {
            io.to(codeId).emit('playerCanStart');
            const stage = getStageByCurrent(codeId)
            if (stage !== null && projetQueue[stage].startedat !== null) {
                io.to(codeId).emit('startEtape', getStartDateOrNow(stage));
                console.log('startedGame : ', codeId)
            }
        }
        
    });
    
    // Leave a room
    socket.on('leaveRoom', (codeId) => {
        socket.leave(codeId);
    });
});

// ------------------------------- CONVENTIONNAL PART -------------------------------


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
        let email = req.body.email;

        let validity = {username: false, password: false, email: false}

        if ((/^[\w\-\.]+@(?:[\w-]+\.)+[a-zA-Z]{2,63}$/).test(email)) {
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
        const userid = TokenManager.refreshTokenInfo(refreshToken).userUid;
        res.status(200).send({jwt: TokenManager.generateJwt(userid)});
    }
    catch (_) {
        res.status(401).send('Unauthorized');
    }
});


/**
 * take a jwt and the application private key
 * return a 200 if valid and a 401 if the credentials aren't valid
 * used only by subapps
 */
app.post('/get-client-validity', TokenManager.verifyAppJwt, (req,res) => {
    res.status(200).send();
});


/**
 * take a user id and the application id
 * return a 200 with jwt if valid and a 401 if the credentials aren't valid
 */
app.post('/generate-specific', TokenManager.verifyJwtToken, (req,res) => {
    try {
        const body = req.body;
        const userId = body.useruid;
        const appId = body.appId;
        res.status(200).send({jwt: TokenManager.generateAppJwt(userId, appId)});
    }
    catch (_) {
        res.status(400).send('Unauthorized');
    }
});


app.post('/create-game', TokenManager.verifyJwtToken, async (req,res)=> {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        const tokenInfo = TokenManager.jwtInfo(token);
        const game = await ProjectsManager.createNewGame(tokenInfo.uid, totalProjectNumber)
        res.status(200).send({...await ProjectsManager.getProjectInfo(game.userid), time: game.startedat})
        addPlayerToQueue(game.id)
        if( playerIsCurrentInStage(game.id, game.currentstage) ) {
            io.to(game.id).emit('playerCanStart');
        }
    }
    catch(error) {
        console.log("create game", error)
        res.status(429).send("une partie est déjà en cours")
    }
})

/**
 * send the ongoin player game to the client
 */
app.post('/get-ongoing-player-game', TokenManager.verifyJwtToken, async(req,res) => {
    try {
        const token = (req.headers.authorization).split(' ')[1];
        const tokenInfo = TokenManager.jwtInfo(token);
        let game = await OngoingModel.getOngoingGameByUserId(tokenInfo.uid)

        if (game) {
            const currentTime = new Date();
            const fiveHourBefore = new Date(currentTime.getTime() - 5 * 60 * 60 * 1000);

            if (game.startedat <= fiveHourBefore) {
                await ProjectsManager.onGoingGameToFinished(game.userid, false, game.score, 7200);
                game = await ProjectsManager.createNewGame(tokenInfo.uid, totalProjectNumber);
            }
        }

        res.status(200).send({...await ProjectsManager.getProjectInfo(tokenInfo.uid), time: game.startedat})

        if( playerIsCurrentInStage(game.id, game.currentstage) ) {
            io.to(game.id).emit('playerCanStart');
        }
    }
    catch(_) {
        res.status(400).send()
    }
})


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
            ProjectsManager.onGoingGameToFinished(onGoingGame.userid, true, await OngoingModel.getOngoingScoreByCode(onGoingGame.id), Date.now()-onGoingGame.startedat, onGoingGame.completedstages);
            io.to(onGoingGame.id).emit('endGame');
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
        const projectId = parseInt(projectsCredentials[1]);
        const pk = projectsCredentials[2];

        const project = await ProjectsManager.verifyProjectPk(projectId, pk)

        const code = req.body.code;
        if (!playerIsCurrentInStage(code, project.order)) {
            throw new Error('Game is not current');
        }
        await OngoingModel.getOngoingGameByCode(code)
        io.to(code).emit('startEtape', getStartDateOrNow(project.order));
        res.status(200).send({})
    }
    catch (error) {
        res.status(401).send()
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






server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
