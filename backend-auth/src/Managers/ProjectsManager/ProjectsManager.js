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

export default {
    getAllProjectsJwt
}