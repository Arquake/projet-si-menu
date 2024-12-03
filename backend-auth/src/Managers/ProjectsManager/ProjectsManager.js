import OngoingModel from "../../Models/OngoingModel/OngoingModel.js";
import ProjectsModel from "../../Models/ProjectsModel/ProjectsModel.js";
import TokenManager from "../TokenManagement/TokenManager.js";

async function getAllProjectsJwt(userId) {
    const projects = await ProjectsModel.getAllProjectsId()
    let projectsArray = []
    projects.forEach((item)=> {
        projectsArray = [
            ...projectsArray,
            {jwt: TokenManager.generateAppJwt(userId, item.id), name: item.name, description: item.description, authors: item.authors, url: item.url, placement: item.placement}
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

async function getNextGame(userId) {
    const currentStage = await OngoingModel.getOngoingGameByUserId(userId).currentStageId
    const nextGame = await OngoingModel.getNextGame(currentStage);

    return {name: nextGame.name, description: nextGame.description, authors: nextGame.authors, url: nextGame.url, placement: nextGame.placement, gameId:currentGame.id}
}


export default {
    getAllProjectsJwt,
    getProjectInfo,
    getNextGame,
    createNewGame
}