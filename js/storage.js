// This file stores functions to save and load data from local storage

import { projects, addProjectToSidebar } from "./main.js";
import {item, project } from "./models.js";
import {createID} from "./utils.js";

export function saveProjectsToStorage(projects) {
    localStorage.setItem('projects',JSON.stringify(projects));
}

export function loadProjectsFromStorage() {
    const storedProjects = localStorage.getItem('projects')

    if (storedProjects) {
        const projectData = JSON.parse(storedProjects);
        return projectData;
    } else {
        console.log('Project data not found in local storage')
    }
}

export function serializeProjects(projects) {
    // returns plain object ready for JSON.stringify()
}

export function deserializeProjects(loadedProjects) {
    //reconstructs full project/item structure from parsed JSON
    for (let projectName in loadedProjects) {
        const rawProject = loadedProjects[projectName];
        const defaultIds = { "All Tasks": "1", "Today": "2", "This Week": "3" };
        const projectId = rawProject.id || defaultIds[projectName] || createID();
        const newProject = new project(projectName, [], projectId);

        for (let rawToDoItem of rawProject.todos) {
             const newItem = new item(
                rawToDoItem.title,
                rawToDoItem.description,
                rawToDoItem.dueDate,
                rawToDoItem.priority,
                rawToDoItem.completed,
                null,
                rawToDoItem.id);
                
                newProject.todos.push(newItem);
         };
         projects[projectName] = newProject;
    }
}