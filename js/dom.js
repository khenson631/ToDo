import { taskList,inputForm,btnAddNewTask } from "./main.js";

export function displayTasks(project) {
    
    if (taskList) {
        taskList.innerHTML = ""; // prevents duplicate DOM entries    
    }
    
    // display header of current tasklist
   let taskListH1 = document.createElement('h1');
    taskListH1.textContent = 'All Tasks';
    taskListH1.textContent = project.name;
    taskListH1.classList.add('taskListH1');
    taskList.appendChild(taskListH1);

    if (project.todos) {
        project.todos.forEach(element => {
        const task = addTaskToDOM(element);
        taskList.appendChild(task);
        });
    }
}

// dynamically insert new items into the taskList div, keyed by project
export function addTaskToDOM(item) {
    
    const task = document.createElement('div');
    task.classList.add('task');

    const leftSide = document.createElement('div');
    leftSide.classList.add('taskLeftSide');
    task.appendChild(leftSide);

    const rightSide = document.createElement('div');
    rightSide.classList.add('taskRightSide');
    task.appendChild(rightSide);

    const bottomHalf = document.createElement('div');
    bottomHalf.classList.add('bottomHalf');
    task.appendChild(bottomHalf);

    const titleDescription = document.createElement('div');
    titleDescription.classList.add('titleDescription');
    task.appendChild(titleDescription);

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

     // task.appendChild(chkComplete);
    leftSide.append(chkComplete);

    // loop thru each property of the item and display it
    for (let key in item) {
        if (item.hasOwnProperty(key)) {
            
            if ([key] == 'id') {
                task.setAttribute('data-id',item[key]);
            }
            
            if ([key] != 'project' && [key] != 'completed' && [key] != 'id') {
                
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
                    label.style.paddingLeft = '2em';
                    rightSide.appendChild(label);
                }
                div.textContent = item[key];
                div.className = [key];
                if (div.id != 'priority') {
                    div.style.paddingLeft = '2em';
                }                
                
                if ([key] == "description" || [key] == 'title') {
                    titleDescription.appendChild(div);
                } else {
                    rightSide.appendChild(div);
                }                      
            }
        }
    }

    // edit button
    const btnEditTask = document.createElement('button');
    btnEditTask.type = 'button';
    btnEditTask.name = 'edit';
    btnEditTask.classList.add('btnEditTask');
    btnEditTask.innerText = 'Edit';
    btnEditTask.style.minWidth = '5rem';
    btnEditTask.style.height = '2em';
    btnEditTask.style.backgroundColor = 'lightgreen';
    btnEditTask.style.marginLeft = '2em';
    rightSide.appendChild(btnEditTask);

    // delete button
    const btnDelete = document.createElement('button');
    btnDelete.type = 'button';
    btnDelete.name = 'delete';
    btnDelete.classList.add('btnDelete');
    btnDelete.innerText = 'Delete';
    task.appendChild(btnDelete);
    btnDelete.style.marginLeft = '1em';
    btnDelete.style.minWidth = '5rem';
    btnDelete.style.height = '2em';
    btnDelete.style.backgroundColor = 'red';
    btnDelete.style.color = 'white';
    rightSide.appendChild(btnDelete);

    return task;
}

export function addNewTaskFormToDom() {

    // Get a reference to the parent container where you want to insert the form
    const parent = document.body; // or document.querySelector('#someContainer')

    // If the form element exists in memory (e.g., inputForm), append it:
    parent.appendChild(inputForm);

}

export function hideAddTaskButton() {
    btnAddNewTask.style.display = 'none';
}

export function displayAddTaskButton() {
    btnAddNewTask.style.display = 'block';
}