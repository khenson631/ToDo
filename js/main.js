"use strict";

import { saveProjectsToStorage, loadProjectsFromStorage, deserializeProjects } from "./storage.js";
import { project } from "./models.js";
import { displayTasks, hideAddTaskButton } from "./dom.js";
import { handleClickEvents, handleFormEvents } from "./events.js";
import { addToTodayAndThisWeekIfApplicable, displayAddTaskForm,hideAddTaskForm,removeFromTodayAndThisWeekIfApplicable  } from "./utils.js";

export let projects = {};
export const taskList = document.getElementById('taskList');
export const sidebar = document.getElementById('sidebar');
export const inputForm = document.getElementById('frmNewTask');
export const btnAddNewTask = document.querySelector("#btnAddNewTask");
export const btnCancelAddTask = document.querySelector('#btnCancelAddTask');
export const frmAddNewProject = document.querySelector("#frmNewProject");
export const btnAddProject = document.querySelector("#btnAddProject");
export const btnCancelProject = document.querySelector("#btnCancelNewProject");
export let projectButtons = document.querySelectorAll('.projectButtons');
export let currentProject = document.getElementById('btnTasks').textContent; // by default, currentProject is Tasks
export let addTaskCalledFrom = 'addMode';
export let btnSubmitNewProject = frmAddNewProject.querySelector("#btnSubmitNewProject");

// set the default projects
// ToDo: Make this dynamic based on buttons in div with id = defaultProjects
projects["All Tasks"] = new project("All Tasks");
projects["Today"] = new project("Today");
projects["This Week"] = new project("This Week");
currentProject = projects["All Tasks"];

// set a default task as an example
// const exampleTask = new item("Example","This item is an example","12/31/2025","Normal",false,"Tasks");
// console.log(exampleTask);
// projects["All Tasks"].addToDoItem(exampleTask); // add the exampleTask to the default Tasks list

// Load from storage and initialize sidebar, display current project tasks
document.addEventListener('DOMContentLoaded', function () {
    
    const loadedProjects = loadProjectsFromStorage();
    deserializeProjects(loadedProjects);

    for (let projectName in loadedProjects) {
         addProjectToSidebar(projectName);
    }

    if (projects["All Tasks"]) {
        currentProject = projects["All Tasks"];
    } else {
        currentProject = Object.values(projects)[0];
    }

    displayTasks(currentProject);
    hideAddTaskForm();
    hideAddTaskButton();

    // Remove from today and this week if applicable
    for (let project in projects) {
        let todos = projects[project].todos;
        for (let todo of todos) {
            if (todo) {
                removeFromTodayAndThisWeekIfApplicable(todo, todo.dueDate, todo.id);
                addToTodayAndThisWeekIfApplicable(todo, todo.dueDate, todo.id);
            }
        }
}
});

// Interact with to do item: Delte, edit, chnge priority
taskList.addEventListener('click', function(event) {
    
    // Delete task item
    if (event.target.classList.contains('btnDelete')) {    
        const card = event.target.closest('.task');
        const id = card.getAttribute('data-id');
        
        for (let project in projects) {
            const task = projects[project].todos.find(b => b.id === id);
            if (task) {
                let projectToDeleteFrom = projects[project];
                task.delete(projectToDeleteFrom);
                displayTasks(currentProject); // Re-render cards after deletion}
            }
        }
        saveProjectsToStorage(projects);
    }

    // Complete task item
    if (event.target.classList.contains('chkComplete')) {
        const card = event.target.closest('.task');
        const id = card.getAttribute('data-id');
        const task = currentProject.todos.find(b => b.id === id);
        if (task) {
            
            if (task.completed === true) {
                task.completed = false;
            } else {
                task.completeItem();
            }
            displayTasks(currentProject);
            saveProjectsToStorage(projects);
        }
    }

    // Edit Task Item
    if (event.target.classList.contains('btnEditTask')) {
        const card = event.target.closest('.task');
        const id = card.getAttribute('data-id');
        const task = currentProject.todos.find(b => b.id === id);
        if (task) {
            // Display inputForm in place of current card
            //addTaskCalledFrom = 'editMode';
            updateAddTaskCalledFrom('editMode');
            card.replaceWith(inputForm);
            populateInputFormWithCurrentTask(task);
            displayAddTaskForm();
            inputForm.setAttribute('data-id',id);        
        }
    }

    // Update item priority
    if (event.target.classList.contains('priority')) {
        const card = event.target.closest('.task');
        const id = card.getAttribute('data-id');
        const task = currentProject.todos.find(b => b.id === id);
        const priorityBtn =  event.target.closest('#priority');

        if (task) {
            
            if (priorityBtn.textContent === "High") {
                task.updatePriority('Normal');
            } else {
                //priorityBtn.checked = true;
                task.updatePriority('High');
            }
            displayTasks(currentProject);
            saveProjectsToStorage(projects);
        }
    }
});

function populateInputFormWithCurrentTask(task) {
        inputForm.querySelector("#title").value = task.title;
        inputForm.querySelector("#description").value = task.description;
        inputForm.querySelector("#dueDate").value = task.dueDate;
        
        let priority = task.priority;
        if (priority === 'High') {
            inputForm.querySelector('#priority').checked = true;
        }
        else {
            inputForm.querySelector('#priority').checked = false;
        }
        inputForm.querySelector('#btnAddTask').textContent = 'Update Task';
}

// Logic for adding new projects
frmAddNewProject.style.display = 'none'; // by default, hide the add project form

btnAddProject.addEventListener('click', function() {
    frmAddNewProject.style.display = 'block';
    btnAddProject.disabled = 'true';
})

// Cancel add new project
btnCancelProject.addEventListener('click', function() {
    frmAddNewProject.style.display = 'none';
    frmAddNewProject.reset();
    btnAddProject.disabled = '';
})

frmAddNewProject.addEventListener('submit', function() { 
    event.preventDefault();

    let projectTitle = frmAddNewProject.querySelector("#newProjectTitle").value;

    if (!projects[projectTitle]) {
        projects[projectTitle] = new project(projectTitle);
    }
    else {
        alert("Project alredy exists!");
        frmAddNewProject.reset();
        return;
    }
    
    saveProjectsToStorage(projects);
    currentProject = projects[projectTitle];    
    displayTasks(currentProject);
    frmAddNewProject.style.display = 'none';
    frmAddNewProject.reset();
    btnAddProject.disabled = '';
    addProjectToSidebar(projectTitle);
})

export function addProjectToSidebar(projectName) {
    if (projectName === 'All Tasks' || projectName === 'Today' || projectName === 'This Week') {
        // do nothing
    } else {
        const projectsList = document.getElementById("projectsList");
        let projectLink = document.createElement('button');
        projectLink.innerHTML = projectName;
        projectLink.classList.add('projectButtons');
        
        let dropdownContainer = document.createElement('div');
        dropdownContainer.classList.add('projectEditContainer');

        let dropdown = document.createElement('button');
        dropdown.innerHTML = '.<br>.<br>.';
        dropdown.classList.add('projectDropdown');
        dropdown.style.border = 'none';

        let dropdownContent = document.createElement('div');
        dropdownContent.classList.add('dropdownContent');
        dropdownContent.style.display = 'none';

        let dropdownEdit = document.createElement('button');
        dropdownEdit.innerHTML = "Edit";
        dropdownEdit.classList.add('projectEdit');

        let dropdownDelete = document.createElement('button');
        dropdownDelete.innerHTML = "Delete";
        dropdownDelete.classList.add('projectDelete');

        dropdownContent.appendChild(dropdownEdit);
        dropdownContent.appendChild(dropdownDelete);
        dropdown.appendChild(dropdownContent);
        dropdownContainer.appendChild(dropdown);
        projectLink.appendChild(dropdownContainer);
        projectsList.appendChild(projectLink);
        displayAddTaskForm();
    }
}

export function updateAddTaskCalledFrom(value) {
    addTaskCalledFrom = value;
}

export function updateCurrentProject(project) {
    currentProject = project;
}

// event listeners from events.js
handleClickEvents();
handleFormEvents();