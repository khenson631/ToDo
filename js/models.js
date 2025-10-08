export class item {
   
    // constructor for todo item
    constructor(title,description,dueDate,priority,completed,project,id) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.id = id;
    }

    updatePriority(priority) {
        this.priority = priority;
    }

    completeItem(completed) {
        this.completed = completed;
    }

    delete(project) {
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

    constructor(name,todos = [],id) {
        this.name = name;
        this.todos = [];
        this.id = id;
    }

    addToDoItem(item) {
        this.todos.push(item);
    }
}