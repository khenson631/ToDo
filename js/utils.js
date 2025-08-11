import {inputForm} from "./main.js";
import { projects } from "./main.js";

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
    // const today = new Date();
    // const todayYYYYMMDD = today.toISOString().split('T')[0];
    // return dueDate === todayYYYYMMDD;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayYYYYMMDD = `${year}-${month}-${day}`;
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
        start: startOfWeek,
        end: endOfWeek
    };
}

export function isDueThisWeek(dueDateStr) {
    // Parse as local date to avoid timezone issues
    const [year, month, day] = dueDateStr.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day, 12, 0, 0, 0); // month is 0-based
    const { start, end } = getCurrentWeekRange();
    return dueDate >= start && dueDate <= end;
}

export function hideAddTaskForm() {
    inputForm.style.display = 'none';
}

export function displayAddTaskForm() {
    inputForm.style.display = 'flex';
}