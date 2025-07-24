"use strict";

const taskList = document.getElementById('taskList');
let currentProject = document.getElementById('btnTasks').textContent; // by default, currentProject is Tasks

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
    constructor(title,description,dueDate,priority,completed,project) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.project = project;
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
// const Tasks = new project('Tasks');
// const Tasks = new project('currentProject',[]);
projects["Tasks"] = new project("Tasks");
currentProject = projects["Tasks"];

// set a default task as an example
// const exampleTask = new item("Example","This item is an example","12/31/2025","Normal",false,"Tasks");
// console.log(exampleTask);
// projects["Tasks"].addToDoItem(exampleTask); // add the exampleTask to the default Tasks list

document.addEventListener('DOMContentLoaded', function () {
    // load tasks at page load if any existing data
    //displayTasks(currentProject.todos); // load the default Tasks list as example
    displayTasks(currentProject); // load the default Tasks list as example
});

// dynamically insert new items into the taskList div, keyed by project
function addTask(item) {
    
    //console.log(item.title);
    
    const task = document.createElement('div');
    task.classList.add('task');

    // loop thru each property of the item and display it
    for (let key in item) {
        if (item.hasOwnProperty(key)) {
            if ([key] != 'project' && [key] != 'completed') {
                //console.log(`${key}: ${item[key]}`);
                const div = document.createElement('div');
                div.textContent = item[key];
                div.className = key;
                task.appendChild(div);
            }
        }
    }

    // checkbox to complete task
    const chkComplete = document.createElement('input');
    chkComplete.type = 'checkbox';
    chkComplete.name = 'complete';
    chkComplete.class = 'chkComplete';
    
    // label for complete check box
    const lblComplete = document.createElement('label');
    lblComplete.htmlFor = 'chkComplete';
    lblComplete.textContent = 'Complete:';
    
    // append complete checkbox and label to dom
    task.appendChild(lblComplete);
    task.appendChild(chkComplete);

    return task;
}

// display tasks
function displayTasks(project) {
    
    taskList.innerHTML = ""; // prevents duplicate DOM entries

    project.todos.forEach(element => {
        const task = addTask(element);
        taskList.appendChild(task);
   });

   // change header of current tasklist
   let taskListH1 = taskList.querySelector("#taskListH1");
   taskListH1.textContent = currentProject.name;
}

const inputForm = document.getElementById('frmNewTask');

console.log('inputForm:', inputForm);

inputForm.addEventListener('submit', function(event) {
    console.log('click event triggered');
    
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

            // let task = new task(title);
            let task = new item(title,description,dueDate,priority,completed,project);
            console.log(task);
            addTask(task);
            currentProject.addToDoItem(task);
            // displayTasks(currentProject.todos)
            displayTasks(currentProject);
        
    // }
})