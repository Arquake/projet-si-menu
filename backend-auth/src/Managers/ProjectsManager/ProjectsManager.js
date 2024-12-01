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
    OngoingModel.createNewGame(userId);
}

async function getProjectJwt(userId) {
    const currentGame = await OngoingModel.getOngoingGame(userId)
    const project = await ProjectsModel.getProjectByPlacement(currentGame.currentStageId)

    return {jwt: TokenManager.generateAppJwt(userId, project.id), name: project.name, description: project.description, authors: project.authors, url: project.url, placement: project.placement}
}

async function getNextGame(userId) {
    const currentStage = await OngoingModel.getOngoingGameByUserId(userId).currentStageId
    const nextGame = await OngoingModel.getNextGame(currentStage);

    return {jwt: TokenManager.generateAppJwt(userId, nextGame.id), name: nextGame.name, description: nextGame.description, authors: nextGame.authors, url: nextGame.url, placement: nextGame.placement}
}


export default {
    getAllProjectsJwt,
    getProjectJwt,
    getNextGame,
    createNewGame
}