import FinishedGameModel from "../../Models/FinishedGameModel.js";
import OngoingModel from "../../Models/OngoingModel/OngoingModel.js";
import ProjectsModel from "../../Models/ProjectsModel/ProjectsModel.js";

async function getAllProjects() {
    const projects = await ProjectsModel.getAllProjects()
    let projectsArray = []
    projects.forEach((item)=> {
        projectsArray = [
            ...projectsArray,
            {name: item.name, description: item.description, authors: item.authors, url: item.url, placement: item.placement}
        ];
    });
    return projectsArray;
}

async function createNewGame(userId) {
    return await OngoingModel.createNewGame(userId);
}

async function getProjectInfo(userId) {
    const currentGame = await OngoingModel.getOngoingGameByUserId(userId)
    const project = await ProjectsModel.getProjecyById(currentGame.currentStage)

    return {name: project.name, description: project.description, authors: project.authors, url: project.url, placement: project.placement, gameId:currentGame.id, currentStage:currentGame.currentStage}
}

async function getNextGame(userId, projectId) {
    
    const nextGame = await OngoingModel.addOneStage(userId)

    return {name: nextGame.name, description: nextGame.description, authors: nextGame.authors, url: nextGame.url, placement: nextGame.placement, gameId:nextGame.id}
}

/**
 * @param timeSpent Time spent in seconds
 */
async function onGoingGameToFinished(userId, finished, timeSpent) {
    const previousGame = await OngoingModel.getOngoingGameByUserId(userId)
    const projectId = previousGame.id
    await FinishedGameModel.createFinishedGame(
        userId,
        previousGame.currentStage,
        finished,
        1000,
        timeSpent
    );
    await OngoingModel.removeOngoingGame(projectId);
}

export default {
    getAllProjects,
    getProjectInfo,
    getNextGame,
    createNewGame,
    onGoingGameToFinished
}