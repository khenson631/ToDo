"use strict";

const taskList = document.getElementById('taskList');

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

    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addToDoItem(item) {
        this.todos.push(item);
    }

}

// set the default projects
const tasks = new project('Tasks');

// set a default task as an example
const exampleTask = new item("Example","This item is an example","12/31/2025","normal",false,"Tasks");
// console.log(exampleTask);
tasks.addToDoItem(exampleTask); // add the exampleTask to the default Tasks list

document.addEventListener('DOMContentLoaded', function () {
    // load tasks at page load if any existing data
    displayTasks(tasks.todos); // load the default Tasks list as example
});

// dynamically insert new items into the taskList div, keyed by project
function addTask(item) {
    
    console.log(item.title);
    
    const task = document.createElement('div');
    task.classList.add('task');

    // loop thru each property of the item and display it
    for (let key in item) {
        if (item.hasOwnProperty(key)) {
            console.log(`${key}: ${item[key]}`);
            const div = document.createElement('div');
            div.textContent = item[key];
            div.class = key;
            task.appendChild(div);
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
    
    project.forEach(element => {
        const task = addTask(element);
        taskList.appendChild(task);
   });
}