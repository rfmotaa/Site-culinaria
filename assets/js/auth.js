document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();

    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) logoutLink.addEventListener('click', handleLogout);

    const editProfileForm = document.getElementById('edit-profile-form');
    if(editProfileForm) {
        loadProfileData();
        editProfileForm.addEventListener('submit', handleEditProfile);
    }
    
    const deleteAccountBtn = document.getElementById('confirm-delete-account-btn');
    if (deleteAccountBtn) deleteAccountBtn.addEventListener('click', handleDeleteAccount);
});


function updateNavbar() {
    const user = getLoggedInUser();
    const navLogin = document.getElementById('nav-login');
    const navProfileIcon = document.getElementById('nav-profile-icon');
    const logoutLink = document.getElementById('logout-link');
    
    if (navLogin && navProfileIcon && logoutLink) {
        if (user) {
            navLogin.style.display = 'none';
            navProfileIcon.style.display = 'block';
            logoutLink.style.display = 'block';
        } else {
            navLogin.style.display = 'block';
            navProfileIcon.style.display = 'none';
            logoutLink.style.display = 'none';
        }
    }
}


function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const users = getUsers();

    if (users.find(user => user.email === email)) {
        alert("Este email já está cadastrado.");
        return;
    }

    const newUser = { id: Date.now(), username, email, password };
    users.push(newUser);
    saveUsers(users);
    alert("Cadastro realizado com sucesso!");
    window.location.reload();
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password, ...userToSave } = user;
        setLoggedInUser(userToSave);
        window.location.href = 'profile.html';
    } else {
        alert("Email ou senha inválidos.");
    }
}

function handleLogout() {
    setLoggedInUser(null);
    window.location.href = 'index.html';
}

function loadProfileData() {
    const user = getLoggedInUser();
    if (user) {
        document.getElementById('profileUsername').value = user.username;
        document.getElementById('profileEmail').value = user.email;
    } else {
        window.location.href = 'login.html';
    }
}

function handleEditProfile(event) {
    event.preventDefault();
    const loggedInUser = getLoggedInUser();
    const newUsername = document.getElementById('profileUsername').value;

    let users = getUsers();
    const userIndex = users.findIndex(u => u.id === loggedInUser.id);

    if (userIndex !== -1) {
        users[userIndex].username = newUsername;
        saveUsers(users);

        const updatedUser = { ...loggedInUser, username: newUsername };
        setLoggedInUser(updatedUser);
        alert("Perfil atualizado com sucesso!");
    }
}

function handleDeleteAccount() {
    const user = getLoggedInUser();

    if (!user) return;

    let recipes = getRecipes().filter(r => r.userId !== user.id);
    saveRecipes(recipes);
    let users = getUsers().filter(u => u.id !== user.id);
    saveUsers(users);
    handleLogout();
}
