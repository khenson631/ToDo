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