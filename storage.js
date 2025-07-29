// This file stores functions to save and load data from local storage

export function saveProjectsToStorage(projects) {
    // example:
    // const userObj = {
    // username = "Maria",
    // email: "maria@mail.com"
    // }

    // localStorage.setItem('user', JSON.stringify(userObj))
    // }

    localStorage.setItem('projects',JSON.stringify(projects));
}

export function loadProjectsFromStorage() {
    // example: 
    const storedProjects = localStorage.getItem('projects')

    if (storedProjects) {
        const projectData = JSON.parse(storedProjects);
        return projectData;
    } else {
        console.log('Project data not found in local storage')
    }

    //localStorage.getItem(projectData);
}

export function serializeProjects(projects) {
    // returns plain object ready for JSON.stringify()
}

export function deserializeProjects(data) {
    //reconstructs full project/item structure from parsed JSON
}

