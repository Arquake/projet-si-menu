import FinishedGameModel from "../../Models/FinishedGameModel.js";
import OngoingModel from "../../Models/OngoingModel/OngoingModel.js";
import ProjectsModel from "../../Models/ProjectsModel/ProjectsModel.js";

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
    const project = await ProjectsModel.getProjecyById(currentGame.currentStage)

    return {name: project.name, description: project.description, authors: project.authors, url: project.url, placement: project.placement, order: project.order, gameId:currentGame.id, currentStage:currentGame.currentStage}
}

async function setNextGame(gameId, completedStages) {
    await OngoingModel.addOneStage(gameId, completedStages)
}

/**
 * @param timeSpent Time spent in seconds
 */
async function onGoingGameToFinished(userId, finished, timeSpent, completedStages) {
    const previousGame = await OngoingModel.getOngoingGameByUserId(userId)
    const projectId = previousGame.id
    await FinishedGameModel.createFinishedGame(
        userId,
        previousGame.currentStage,
        finished,
        1000,
        timeSpent,
        completedStages
    );
    await OngoingModel.removeOngoingGame(projectId);
}

export default {
    getAllProjects,
    getProjectInfo,
    setNextGame,
    createNewGame,
    onGoingGameToFinished
}