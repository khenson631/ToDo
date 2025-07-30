"use strict";

import { saveProjectsToStorage, loadProjectsFromStorage, serializeProjects, deserializeProjects } from "./storage.js";

const taskList = document.getElementById('taskList');
let currentProject = document.getElementById('btnTasks').textContent; // by default, currentProject is Tasks
const sidebar = document.getElementById('sidebar');
export let projects = {};
let addTaskCalledFrom = 'addMode';

export class item {
   
    // constructor for todo item
    constructor(title,description,dueDate,priority,completed,project,id) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        //this.project = project;
        //this.project = toString(project);
        this.id = id;
    }

    updatePriority(priority) {
        this.priority = priority;
    }

    completeItem(id) {
        this.completed = true;
    }

    delete(project) {
        // currentProject.todos.splice(currentProject.todos.findIndex(item => item.id === this.id), 1)
        project.todos.splice(project.todos.findIndex(item => item.id === this.id), 1)
    }

    edit(title,description,dueDate,priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

// have different projects to store todo items
export class project {

    constructor(name,todos = []) {
        this.name = name;
        this.todos = todos;
    }

    addToDoItem(item) {
        this.todos.push(item);
    }
}

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

document.addEventListener('DOMContentLoaded', function () {
    
    const loadedProjects = loadProjectsFromStorage();
    deserializeProjects(loadedProjects);
    
    if (projects["Tasks"]) {
        currentProject = projects["Tasks"];
    } else {
        currentProject = Object.values(projects)[0];
    }

    displayTasks(currentProject);

    hideAddTaskForm();
});

// dynamically insert new items into the taskList div, keyed by project
function addTaskToDOM(item) {
    
    //console.log(item.title);
    
    const task = document.createElement('div');
    task.classList.add('task');

    // checkbox to complete task
    const chkComplete = document.createElement('input');
    chkComplete.type = 'checkbox';
    chkComplete.name = 'complete';
    chkComplete.classList.add('chkComplete');

    if (item['completed'] === true) {
        chkComplete.checked = true;
    } else {
        chkComplete.checked = false;
    }

    task.appendChild(chkComplete);

    // loop thru each property of the item and display it
    for (let key in item) {
        if (item.hasOwnProperty(key)) {
            
            if ([key] == 'id') {
                task.setAttribute('data-id',item[key]);
            }
            
            if ([key] != 'project' && [key] != 'completed' && [key] != 'id') {
                //console.log(`${key}: ${item[key]}`);
                
                let element = '';
                let elementType = '';
                
                // if priority, add a checkbox
                if ([key] == 'priority') {                
                    element = 'input';
                    elementType = 'checkbox';
                }
                else {
                    element = 'div';
                    elementType = '';
                }
                
                //let div = document.createElement('div');
                let div = document.createElement(element);
                if (elementType) {
                    div.type = elementType;
                    div.id = [key];
                    
                    let priority = item['priority'];
                    let checked = false;
                    if (priority === 'High') {
                        checked = true;
                    }
                    div.checked = checked;

                    let label = document.createElement('label');
                    label.htmlFor = 'priority';
                    label.textContent = 'High Priority:';
                    task.appendChild(label);
                }
                div.textContent = item[key];
                div.className = [key];
                task.appendChild(div);
                             
            }
        }
    }

    // delete button
    const btnDelete = document.createElement('button');
    btnDelete.type = 'button';
    btnDelete.name = 'delete';
    btnDelete.classList.add('btnDelete');
    btnDelete.innerText = 'Delete';
    task.appendChild(btnDelete);

    // edit button
    const btnEditTask = document.createElement('button');
    btnEditTask.type = 'button';
    btnEditTask.name = 'edit';
    btnEditTask.classList.add('btnEditTask');
    btnEditTask.innerText = 'Edit';
    task.appendChild(btnEditTask);

    return task;
}

// display tasks
function displayTasks(project) {
    
    if (taskList) {
        taskList.innerHTML = ""; // prevents duplicate DOM entries    
    }
    
    // display header of current tasklist
   let taskListH1 = document.createElement('h1');
   taskListH1.textContent = project.name;
   taskList.appendChild(taskListH1);

    if (project.todos) {
        project.todos.forEach(element => {
        const task = addTaskToDOM(element);
        taskList.appendChild(task);
        });
    }
}

const inputForm = document.getElementById('frmNewTask');

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
           // projects["Today"].addToDoItem(task);
            projects["Today"].todos.splice(projects["Today"].todos.findIndex(item => item.id === id), 1)
        }    
    }
    
    const inThisWeekList = projects["This Week"].todos.find(a => a.id === id);
    if (inThisWeekList) {
        if (!isDueThisWeek(dueDate)) {
            // projects["This Week"].addToDoItem(task);
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
            //const task = currentProject.todos.find(b => b.id === id);
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
        
        //let priority = inputForm.querySelector('#priority').checked;
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

const btnAddNewTask = document.querySelector("#btnAddNewTask");
const btnCancelAddTask = document.querySelector('#btnCancelAddTask');

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