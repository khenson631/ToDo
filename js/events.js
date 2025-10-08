// All form event listeners and click handling go in this file
import { inputForm,currentProject,addTaskCalledFrom,btnAddNewTask,btnCancelAddTask,projects,updateAddTaskCalledFrom,updateCurrentProject } from "./main.js";
import { addToTodayAndThisWeekIfApplicable,createID,displayAddTaskForm,findProject,hideAddTaskForm,removeFromTodayAndThisWeekIfApplicable,deleteById } from "./utils.js";
import { displayTasks,addTaskToDOM,addNewTaskFormToDom,hideAddTaskButton, displayAddTaskButton } from "./dom.js";
import { loadProjectsFromStorage, saveProjectsToStorage} from "./storage.js";
import { item } from "./models.js";

const projectDropdown = document.querySelector('.projectDropdown');

export function handleFormEvents() {
    inputForm.addEventListener('submit', function(event) {
    event.preventDefault();

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
    
    //// Edit Mode /////
    if (addTaskCalledFrom === 'editMode') {
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
        displayAddTaskButton();
    }
    //// Add Mode ////
    else if (addTaskCalledFrom === 'addMode') {
        inputForm.setAttribute('data-id','');
        const id = createID();
        let task = new item(title,description,dueDate,priority,completed,project,id);
        currentProject.addToDoItem(task);
        addTaskToDOM(task);            
        displayTasks(currentProject);
        inputForm.reset();
        saveProjectsToStorage(projects);
        displayAddTaskButton();
        
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
        // Project button click
        if ((event.target.classList.contains('projectButtons')) || (event.target.classList.contains('defaultProjectButtons'))) {
            let button = event.target;

            const projectId = event.target.closest('[data-id]')?.getAttribute('data-id');
            const project = findProject(projectId);
            
            if (project) {
                updateCurrentProject(project);
            } else {
                console.warn('No data-id found on clicked element or its parents.');
            }

                // "Today" and "This Week" can not be added to, they just display whatever is due this day/week
                if (button.innerHTML === 'Today' || button.innerHTML === 'This Week' || button.innerHTML === 'All Tasks') {
                    hideAddTaskForm();
                    displayTasks(currentProject);
                    hideAddTaskButton();
                    return;            
                }
                else {
                    displayAddTaskButton();
                    displayAddTaskForm();
                    displayTasks(currentProject);
                    hideAddTaskForm();
                }            
        }
        
        // Dropdown dots click
        if (event.target.classList.contains('projectDropdown')) {
            event.stopPropagation();
            const dropdownContainer = event.target.closest('.projectEditContainer');
            const dropdownContent = dropdownContainer.querySelector('.dropdownContent');
            dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
        }

        // Edit project name
        if (event.target.classList.contains('projectEdit')) {
            const projectButton = event.target.closest('.projectButtons');
            const id = projectButton.getAttribute('data-id');
            // TODO: Show edit form/modal for project name using id
        }

        // Delete project
        if (event.target.classList.contains('projectDelete')) {
            const projectButton = event.target.closest('.projectButtons');
            const id = projectButton.getAttribute('data-id');
            var result = confirm("Are you sure you want to delete the project? This action cannot be undone.");
            if (result) {
                deleteById(projects, id);
                saveProjectsToStorage(projects);
                displayTasks(projects['All Tasks']);
                // Optionally remove the button from DOM
                projectButton.remove();
            }
        }

        // Hide dropdowns when clicking outside
        if (!event.target.classList.contains('projectDropdown')) {
            document.querySelectorAll('.dropdownContent').forEach(dc => dc.style.display = 'none');
        }
    })
}