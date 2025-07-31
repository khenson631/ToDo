"use strict";

export let projects = {};
import { saveProjectsToStorage, loadProjectsFromStorage, serializeProjects, deserializeProjects } from "./storage.js";
import {item, project } from "./models.js";
import { displayTasks, addTaskToDOM } from "./dom.js";


const taskList = document.getElementById('taskList');
const sidebar = document.getElementById('sidebar');
const inputForm = document.getElementById('frmNewTask');
const btnAddNewTask = document.querySelector("#btnAddNewTask");
const btnCancelAddTask = document.querySelector('#btnCancelAddTask');
let currentProject = document.getElementById('btnTasks').textContent; // by default, currentProject is Tasks
let addTaskCalledFrom = 'addMode';

// set the default projects
// ToDo: Make this dynamic based on buttons in div with id = defaultProjects
projects["Tasks"] = new project("Tasks");
projects["Today"] = new project("Today");
projects["This Week"] = new project("This Week");
currentProject = projects["Tasks"];

// set a default task as an example
// const exampleTask = new item("Example","This item is an example","12/31/2025","Normal",false,"Tasks");
// console.log(exampleTask);
// projects["Tasks"].addToDoItem(exampleTask); // add the exampleTask to the default Tasks list

// Load from storage and initialize sidebar, display current project tasks
document.addEventListener('DOMContentLoaded', function () {
    
    const loadedProjects = loadProjectsFromStorage();
    deserializeProjects(loadedProjects);

    for (let projectName in loadedProjects) {
         addProjectToSidebar(projectName);
    }

    if (projects["Tasks"]) {
        currentProject = projects["Tasks"];
    } else {
        currentProject = Object.values(projects)[0];
    }

    displayTasks(currentProject);
    hideAddTaskForm();
});

inputForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const buttonValue = event.target.value;

    // do add stuff
    // get inputs from form
    // title,description,dueDate,priority,completed,project
    const title = inputForm.querySelector('#title').value;
    const description = inputForm.querySelector('#description').value;
    const dueDate = inputForm.querySelector('#dueDate').value;
    
    let priority = inputForm.querySelector('#priority').checked;
    if (priority === true) {
        priority = 'High';
    }
    else {
        priority = 'Normal';
    }

    const completed = false;
    const project = currentProject;
    
    if (addTaskCalledFrom === 'editMode') {
        // do edit stuff
        const id = inputForm.getAttribute('data-id');
        // find task by id and update
        for (let project in projects) {
            //const task = currentProject.todos.find(b => b.id === id);
            const task = projects[project].todos.find(b => b.id === id);
            if (task) {
                task.edit(title,description,dueDate,priority)
                addToTodayAndThisWeekIfApplicable(task,dueDate,id);
                removeFromTodayAndThisWeekIfApplicable(task,dueDate,id);
                //let projectToDeleteFrom = projects[project];
                //task.delete(projectToDeleteFrom);
                //displayTasks(currentProject); // Re-render cards after deletion}
            }
        }
        displayTasks(currentProject);
        inputForm.reset();
        saveProjectsToStorage(projects);
    }
    else if (addTaskCalledFrom === 'addMode') {
        inputForm.setAttribute('data-id','');
        const id = createID();
        let task = new item(title,description,dueDate,priority,completed,project,id);
        currentProject.addToDoItem(task);
        addTaskToDOM(task);            
        displayTasks(currentProject);
        inputForm.reset();
        saveProjectsToStorage(projects);
        
        // If task is due today or this week, display in the Today/This Week projects, respectively.
        addToTodayAndThisWeekIfApplicable(task,dueDate,id);
    }

    hideAddTaskForm();
})

function addToTodayAndThisWeekIfApplicable(task,dueDate,id) {

    const inTodayList = projects["Today"].todos.find(a => a.id === id);
    if (!inTodayList) {
        if (dueDateEqualsToday(dueDate)) {
        projects["Today"].addToDoItem(task);
        }    
    }
    
    const inThisWeekList = projects["This Week"].todos.find(a => a.id === id);
    if (!inThisWeekList) {
        if (isDueThisWeek(dueDate)) {
            projects["This Week"].addToDoItem(task);
        }
    }
}

function removeFromTodayAndThisWeekIfApplicable(task,dueDate,id) {

    const inTodayList = projects["Today"].todos.find(a => a.id === id);
    if (inTodayList) {
        if (!dueDateEqualsToday(dueDate)) {
            projects["Today"].todos.splice(projects["Today"].todos.findIndex(item => item.id === id), 1)
        }    
    }
    
    const inThisWeekList = projects["This Week"].todos.find(a => a.id === id);
    if (inThisWeekList) {
        if (!isDueThisWeek(dueDate)) {
            projects["This Week"].todos.splice(projects["This Week"].todos.findIndex(item => item.id === id), 1)
        }
    }
}

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
        }
        saveProjectsToStorage(projects);
    }

    // ToDo: Edit Task Item
    if (event.target.classList.contains('btnEditTask')) {
        const card = event.target.closest('.task');
        const id = card.getAttribute('data-id');
        const task = currentProject.todos.find(b => b.id === id);
        if (task) {
            // Display inputForm in place of current card
            addTaskCalledFrom = 'editMode';
            card.replaceWith(inputForm);
            populateInputFormWithCurrentTask(task);
            displayAddTaskForm();
            inputForm.setAttribute('data-id',id);
            
            // auto populate inputform with current card attributes
            // if clcikcing add (should rename to update), edit task
            // then display tasks
            // and save to storage
            //and hide add task form
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

        //const completed = false;
        //const project = currentProject;
        //const id = task.id;
        inputForm.querySelector('#btnAddTask').textContent = 'Update Task';
}

// function to create unique ID per ToDo item
function createID() {
    return crypto.randomUUID();
}

// Logic for adding new projects
const frmAddNewProject = document.querySelector("#frmNewProject");
const btnAddProject = document.querySelector("#btnAddProject");
const btnCancelProject = document.querySelector("#btnCancelNewProject");

frmAddNewProject.style.display = 'none'; // by default, hide the add project form

btnAddProject.addEventListener('click', function(event) {
    frmAddNewProject.style.display = 'block';
    btnAddProject.disabled = 'true';
})

// Cancel add new project
btnCancelProject.addEventListener('click', function(event) {
    frmAddNewProject.style.display = 'none';
    frmAddNewProject.reset();
    btnAddProject.disabled = '';
})

let btnSubmitNewProject = frmAddNewProject.querySelector("#btnSubmitNewProject");

frmAddNewProject.addEventListener('submit', function(event) { 
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
    if (projectName === 'Tasks' || projectName === 'Today' || projectName === 'This Week') {
        // do nothing
    } else {
        const projectsList = document.getElementById("projectsList");
        let projectLink = document.createElement('button');
        projectLink.innerHTML = projectName;
        projectLink.classList.add('projectButtons');
        projectsList.appendChild(projectLink);
        displayAddTaskForm();
    }
}

let projectButtons = document.querySelectorAll('.projectButtons');

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('projectButtons')) {
        let button = event.target;
         currentProject = projects[button.innerHTML];

            // "Today" and "This Week" can not be added to, they just display whatever is due this day/week
            if (button.innerHTML === 'Today' || button.innerHTML === 'This Week') {
                hideAddTaskForm();
                displayTasks(currentProject);
                return;
            }
        displayAddTaskForm();
        displayTasks(currentProject);
         hideAddTaskForm();
    }
})

function hideAddTaskForm() {
    inputForm.style.display = 'none';
}

function displayAddTaskForm() {
    inputForm.style.display = 'flex';
}

function dueDateEqualsToday(dueDate) {
    const today = new Date();
    const todayYYYYMMDD = today.toISOString().split('T')[0];
    return dueDate === todayYYYYMMDD;
}

function getCurrentWeekRange() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek); // back to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // forward to Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    return {
        start: startOfWeek.toISOString().split('T')[0],
        end: endOfWeek.toISOString().split('T')[0]
    };
}

function isDueThisWeek(dueDateStr) {
    const dueDate = new Date(dueDateStr);
    const { start, end } = getCurrentWeekRange();

    const startDate = new Date(start);
    const endDate = new Date(end);

    return dueDate >= startDate && dueDate <= endDate;
}

btnAddNewTask.addEventListener('click', function(event) {
    addTaskCalledFrom = 'addMode';
    displayAddTaskForm();
    inputForm.querySelector('#btnAddTask').textContent = 'Add Task';
})

btnCancelAddTask.addEventListener('click',function(event) {
    inputForm.reset();
    hideAddTaskForm();
    displayTasks(currentProject);
})