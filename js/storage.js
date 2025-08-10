// This file stores functions to save and load data from local storage

import { projects, addProjectToSidebar } from "./main.js";
import {item, project } from "./models.js";

export function saveProjectsToStorage(projects) {
    localStorage.setItem('projects',JSON.stringify(projects));
}

export function loadProjectsFromStorage() {
    // example: 
    const storedProjects = localStorage.getItem('projects')

    if (storedProjects) {
        const projectData = JSON.parse(storedProjects);
        return projectData;
    } else {
        console.log('Project data not found in local storage')
    }

    //localStorage.getItem(projectData);
}

export function serializeProjects(projects) {
    // returns plain object ready for JSON.stringify()
}

export function deserializeProjects(loadedProjects) {
    //reconstructs full project/item structure from parsed JSON

    //Loop through the restored projects keys and for each:
        //Create a new project instance    
        //For each todo inside, create new item instances using the raw data
        //Reassign this fully rebuilt object to your global projects 
    //for (let key in loadedProjects) {
        // projects[key] = new project(key);
    
    for (let projectName in loadedProjects) {
        // const rawProject = loadedProjects[projectName];
        // const newProject = new project(projectName);
        const rawProject = loadedProjects[projectName];
        const newProject = new project(projectName);

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
         //console.log
         //newProject.todos.push(newItem);
         projects[projectName] = newProject;
        //  addProjectToSidebar(projectName);
    }

}

