import {inputForm,projects} from "./main.js";
import {item} from "./models.js";

export function addToTodayAndThisWeekIfApplicable(task,dueDate,id) {

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

export function removeFromTodayAndThisWeekIfApplicable(task,dueDate,id) {

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

// function to create unique ID per ToDo item
export function createID() {
    return crypto.randomUUID();
}

export function dueDateEqualsToday(dueDate) {
    const today = new Date();
    const todayYYYYMMDD = today.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
    return dueDate === todayYYYYMMDD;
}

export function getCurrentWeekRange() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek); // back to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // forward to Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    return {
        start: startOfWeek.toLocaleDateString('en-CA'), // local YYYY-MM-DD
        end: endOfWeek.toLocaleDateString('en-CA')
    };
}

export function isDueThisWeek(dueDateStr) {
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0); // normalize time

    const { start, end } = getCurrentWeekRange();
    const startDate = new Date(start);
    const endDate = new Date(end);

    return dueDate >= startDate && dueDate <= endDate;
}

export function hideAddTaskForm() {
    inputForm.style.display = 'none';
}

export function displayAddTaskForm() {
    inputForm.style.display = 'flex';
}

export function findProject(id) {
     for (let project in projects) {
            if (projects[project].id === id) {
                return projects[project];
            }
     }
}

export function deleteById(obj, id) {
  for (const key in obj) {
    if (obj[key].id === id) {
      delete obj[key];
      break;
    }
  }
}

// kh 10/08/25 Function to delete task from all projects
export function deleteCurrentProjectTasksFromAllProjects(id) {
    let projectBeingDeleted = findProject(id);
    for (let taskKey in projectBeingDeleted.todos){
        let id = projectBeingDeleted.todos[taskKey].id;
        for (let project in projects) {                                    
            const task = projects[project].todos.find(b => b.id === id);
            if (task) {
                task.delete(projects[project]);
            }
        }
    }
}

export function taskExistsInProject(project, id) {
  for (let key in projects[project].todos) {
    if (projects[project].todos[key].id === id) {
      return true;
    }
  }
}

export function addToAllTasksIfApplicable(task,id) {
    const inAllTasks = projects["All Tasks"].todos.find(a => a.id === id);
    if (!inAllTasks) {
        projects["All Tasks"].addToDoItem(task);
    }    
}