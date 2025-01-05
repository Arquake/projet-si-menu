import FinishedGameModel from "../../Models/FinishedGameModel.js";
import OngoingModel from "../../Models/OngoingModel/OngoingModel.js";
import ProjectsModel from "../../Models/ProjectsModel/ProjectsModel.js";


const DEVMODE = process.env.DEVMODE || true

async function getAllProjects() {
    const projects = await ProjectsModel.getAllProjects()
    let projectsArray = []
    projects.forEach((item)=> {
        projectsArray = [
            ...projectsArray,
            {name: item.name, description: item.description, authors: item.authors, url: item.url, placement: item.placement, order: item.order}
        ];
    });
    return projectsArray;
}

async function createNewGame(userId, arrayLength) {
    return await OngoingModel.createNewGame(userId, arrayLength);
}

async function getProjectInfo(userId) {
    const currentGame = await OngoingModel.getOngoingGameByUserId(userId)
    const project = await ProjectsModel.getProjecyById(currentGame.currentstage)

    return {name: project.name, description: project.description, authors: project.authors, url: project.url, placement: project.placement, order: project.order, gameId:currentGame.id, currentstage:currentGame.currentstage}
}

async function setNextGame(gameId, completedStages) {
    await OngoingModel.addOneStage(gameId, completedStages)
}

/**
 * @param timeSpent Time spent in seconds
 */
async function onGoingGameToFinished(userId, finished, score, timeSpent, completedStages) {
    const previousGame = await OngoingModel.getOngoingGameByUserId(userId)
    const projectId = previousGame.id
    const previousGameStage = previousGame.currentstage
    await OngoingModel.removeOngoingGame(projectId);
    return await FinishedGameModel.createFinishedGame(
        userId,
        previousGameStage,
        finished,
        score,
        timeSpent,
        completedStages
    );
    
}


async function verifyProjectPk(projectId, pk) {

    const project = await ProjectsModel.getProjecyById(projectId)

    if (!DEVMODE) {
        argon2.verify(project.privatekey, pk);
    }

    return project
}

export default {
    getAllProjects,
    getProjectInfo,
    setNextGame,
    createNewGame,
    onGoingGameToFinished,
    verifyProjectPk
}