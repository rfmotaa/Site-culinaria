function getRecipes() {
    return JSON.parse(localStorage.getItem('recipes')) || [];
}

function saveRecipes(recipes) {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem('loggedInUser'));
}

function setLoggedInUser(user) {
    if (user) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    } else {
        sessionStorage.removeItem('loggedInUser');
    }
}

