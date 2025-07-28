"use strict";

const taskList = document.getElementById('taskList');
let currentProject = document.getElementById('btnTasks').textContent; // by default, currentProject is Tasks
const sidebar = document.getElementById('sidebar');
const projects = {};

document.getElementById("sidebar").addEventListener("click", function(event) {
    if (event.target.tagName === "BUTTON") {
        const clickedName = event.target.textContent;
        if (!projects[clickedName]) {
            projects[clickedName] = new project(clickedName);
        }
        currentProject = projects[clickedName];
        // console.log("Last clicked button ID:", currentProject);
    }
});

class item {
   
    // constructor for todo item
    constructor(title,description,dueDate,priority,completed,project,id) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.project = project;
        this.id = id;
    }

    updatePriority(priority) {
        this.priority = priority;
    }

    completeItem(id) {
        this.completed = true;
    }

    delete() {
        currentProject.todos.splice(currentProject.todos.findIndex(item => item.id === this.id), 1)
    }
}

// have different projects to store todo items
class project {

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
    // load tasks at page load if any existing data
    //displayTasks(currentProject.todos); // load the default Tasks list as example
    // displayTasks(currentProject); // load the default Tasks list as example
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

    //alert(projects[project]);

    // let todos = projects[project].todos;

    project.todos.forEach(element => {
        const task = addTaskToDOM(element);
        taskList.appendChild(task);
   });

}

const inputForm = document.getElementById('frmNewTask');

inputForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // if (event.target.tagName === 'SUBMIT') {
        const buttonValue = event.target.value;

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
            const id = createID();

            // let task = new task(title);
            let task = new item(title,description,dueDate,priority,completed,project,id);
            console.log(task);
            currentProject.addToDoItem(task);
            addTaskToDOM(task);            
            displayTasks(currentProject);
            inputForm.reset();
            // ToDo: If task is due today or this week, display in the Today/This Week projects, respectively.
    // }
})

// Interact with to do item: Delte, edit, chnge priority
// let toDoItem = document.querySelectorAll(".task ");

// // class = chkComplete

// //document.body.addEventListener("click", function(e) {
// toDoItem.addEventListener("click", function(e) {
//   if (e.target.classList.contains("chkComplete")) {
//     alert('complete!' + this.id);
//   }
// })

taskList.addEventListener('click', function(event) {
    
    // Delete task item
    if (event.target.classList.contains('btnDelete')) {    
        const card = event.target.closest('.task');
        const id = card.getAttribute('data-id');
        const task = currentProject.todos.find(b => b.id === id);
        if (task) {
            task.delete();
            displayTasks(currentProject); // Re-render cards after deletion}
        }
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
    }
});


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

//frmAddNewProject.addEventListener('submit', function(event){
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
    
    currentProject = projects[projectTitle];
    displayTasks(currentProject);
    frmAddNewProject.style.display = 'none';
    frmAddNewProject.reset();
    btnAddProject.disabled = '';
    addProjectToSidebar(projectTitle);
})

function addProjectToSidebar(projectName) {
    const projectsList = document.getElementById("projectsList");
    let projectLink = document.createElement('button');
    projectLink.innerHTML = projectName;
    projectLink.classList.add('projectButtons');
    projectsList.appendChild(projectLink);
    displayAddTaskForm();
}

// let projectButtons = sidebar.querySelectorAll('.projectButtons');
let projectButtons = document.querySelectorAll('.projectButtons');

//projectButtons.forEach((button => {
//    button.addEventListener('click', () => {

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('projectButtons')) {

        let button = event.target;

        console.log('project: ' + button.innerHTML);
        
         currentProject = projects[button.innerHTML];

            // "Today" and "This Week" can not be added to, they just display whatever is due this day/week
            if (button.innerHTML === 'Today' || button.innerHTML === 'This Week') {
                // ToDo: Display today and this week tasks
                hideAddTaskForm();
                displayTasks(currentProject);
                return;
            }
        displayAddTaskForm();
        displayTasks(currentProject);
    }
})

function hideAddTaskForm() {
    inputForm.style.display = 'none';
}

function displayAddTaskForm() {
    inputForm.style.display = 'flex';
}