// All form event listeners and click handling go in this file
import { inputForm,currentProject,addTaskCalledFrom,btnAddNewTask,btnCancelAddTask,projects,updateAddTaskCalledFrom,updateCurrentProject } from "./main.js";
import { addToTodayAndThisWeekIfApplicable,createID,displayAddTaskForm,findProject,hideAddTaskForm,removeFromTodayAndThisWeekIfApplicable } from "./utils.js";
import { displayTasks,addTaskToDOM,addNewTaskFormToDom,hideAddTaskButton, displayAddTaskButton } from "./dom.js";
import { saveProjectsToStorage} from "./storage.js";
import { item } from "./models.js";

const btnEditProject = document.querySelector('.projectDropdown');

export function handleFormEvents() {
    // do stuff
    inputForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // const buttonValue = event.target.value;

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
            const task = projects[project].todos.find(b => b.id === id);
            if (task) {
                task.edit(title,description,dueDate,priority)
                addToTodayAndThisWeekIfApplicable(task,dueDate,id);
                removeFromTodayAndThisWeekIfApplicable(task,dueDate,id);
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
        projects["All Tasks"].addToDoItem(task); // Add all projects to the "All Tasks" list by default
    }
    hideAddTaskForm();
})
}

export function handleClickEvents() {
    // do stuff
    btnAddNewTask.addEventListener('click', function(event) {
        updateAddTaskCalledFrom('addMode');
        displayAddTaskForm();
        hideAddTaskButton();
        inputForm.querySelector('#btnAddTask').textContent = 'Add Task';
    })

    btnCancelAddTask.addEventListener('click',function(event) {
        inputForm.reset();
        hideAddTaskForm();
        displayAddTaskButton();
        displayTasks(currentProject);
        inputForm.setAttribute('data-id', '');
        addNewTaskFormToDom();
    })

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('projectButtons')) {
            let button = event.target;
            updateCurrentProject(findProject(event.target.getAttribute('data-id')));

                // "Today" and "This Week" can not be added to, they just display whatever is due this day/week
                if (button.innerHTML === 'Today' || button.innerHTML === 'This Week') {
                    hideAddTaskForm();
                    displayTasks(currentProject);
                    hideAddTaskButton();
                    return;
                }
                else if (button.innerHTML === 'All Tasks')  {
                    hideAddTaskButton();
                    hideAddTaskForm();
                    updateCurrentProject(projects['All Tasks']);
                    displayTasks(currentProject);
                }
                else {
                    displayAddTaskButton();
                }
            displayAddTaskForm();
            displayTasks(currentProject);
            hideAddTaskForm();

        }
        
        if (event.target.classList.contains('projectDropdown')) {
            //TODO: show dropdown options
            let dropdownContent = document.querySelector('.dropdownContent');
            dropdownContent.style.display = 'flex';
                // make dropdown options menu appear above dots
                // when clicking elsewhere, close the dropdown options menu

            //TODO: edit project name

            //TODO: delete project
        }
    })
}