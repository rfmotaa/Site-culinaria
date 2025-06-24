document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('profile.html')) {
        const user = getLoggedInUser();

        if (!user) {
            window.location.href = 'login.html'; 
            return;
        }

        loadMyRecipes(); 

        const recipeForm = document.getElementById('recipe-form');
        if (recipeForm) {
            recipeForm.addEventListener('submit', handleSaveRecipe);
        }

        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        cancelEditBtn.addEventListener('click', cancelEdit);
        
        const confirmDeleteBtn = document.getElementById('confirm-delete-recipe-btn');
        confirmDeleteBtn.addEventListener('click', confirmDeleteRecipe);
    }
});

let recipeToDeleteId = null; 
const myRecipesModal = new bootstrap.Modal(document.getElementById('deleteRecipeModal'));

function loadMyRecipes() {
    const user = getLoggedInUser();
    const allRecipes = getRecipes();
    const myRecipes = allRecipes.filter(recipe => recipe.userId === user.id);

    const grid = document.getElementById('my-recipes-grid');
    grid.innerHTML = '';

    if (myRecipes.length === 0) {
        grid.innerHTML = '<p>Você ainda não cadastrou nenhuma receita.</p>';
        return;
    }

    myRecipes.forEach(recipe => {
        const card = `
            <div class="col">
                <div class="card h-100">
                    <img src="${recipe.base64Image}" class="card-img-top" alt="${recipe.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text text-muted small">Tempo: ${recipe.prepTime}</p>
                        <div class="mt-auto">
                            <button class="btn btn-sm btn-outline-primary" onclick="editRecipe(${recipe.id})"><i class="bi bi-pencil"></i> Editar</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="prepareDeleteRecipe(${recipe.id})"><i class="bi bi-trash"></i> Excluir</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

function handleSaveRecipe(event) {
    event.preventDefault();

    const user = getLoggedInUser();
    const recipeId = document.getElementById('recipeId').value;
    const title = document.getElementById('recipeTitle').value;
    const imageInput = document.getElementById('recipeimageFile');
    const imageFile = imageInput.files[0];
    const prepTime = document.getElementById('recipePrepTime').value;
    const ingredients = document.getElementById('recipeIngredients').value;
    const instructions = document.getElementById('recipeInstructions').value;

    let recipes = getRecipes();

    if (imageFile) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const base64Image = e.target.result;

            salvarReceita(recipes, user, recipeId, title, base64Image, prepTime, ingredients, instructions);
        };

        reader.readAsDataURL(imageFile);
    } else {
        // Caso o usuário não selecione uma nova imagem (em edição), recupera a imagem já existente
        let base64Image = '';
        if (recipeId) {
            const existingRecipe = recipes.find(r => r.id == recipeId);
            base64Image = existingRecipe ? existingRecipe.base64Image : '';
        }

        salvarReceita(recipes, user, recipeId, title, base64Image, prepTime, ingredients, instructions);
    }
}

function salvarReceita(recipes, user, recipeId, title, base64Image, prepTime, ingredients, instructions) {
    if (recipeId) {
        const recipeIndex = recipes.findIndex(r => r.id == recipeId);

        if (recipeIndex !== -1) {
            recipes[recipeIndex] = {
                ...recipes[recipeIndex],
                title,
                base64Image,
                prepTime,
                ingredients,
                instructions
            };
        }

    } else {
        const newRecipe = {
            id: Date.now(),
            userId: user.id,
            title,
            base64Image,
            prepTime,
            ingredients,
            instructions
        };

        recipes.push(newRecipe);
    }

    saveRecipes(recipes);
    alert('Receita salva com sucesso!');
    cancelEdit();
    loadMyRecipes();
}

function editRecipe(id) {
    const recipes = getRecipes();
    const recipe = recipes.find(r => r.id === id);

    if (recipe) {
        document.getElementById('recipe-form-title').innerText = "Editar Receita";
        document.getElementById('recipeId').value = recipe.id;
        document.getElementById('recipeTitle').value = recipe.title;
        document.getElementById('recipePrepTime').value = recipe.prepTime;
        document.getElementById('recipeIngredients').value = recipe.ingredients;
        document.getElementById('recipeInstructions').value = recipe.instructions;
        document.getElementById('recipeimageFile').value = ""; // Limpa o campo de upload
        document.getElementById('save-recipe-btn').innerText = "Salvar Alterações";
        document.getElementById('cancel-edit-btn').style.display = 'inline-block';
        window.scrollTo(0, 0);
    }
}

function cancelEdit() {
    document.getElementById('recipe-form-title').innerText = "Adicionar Nova Receita";
    document.getElementById('recipe-form').reset();
    document.getElementById('recipeId').value = '';
    document.getElementById('save-recipe-btn').innerText = "Salvar Receita";
    document.getElementById('cancel-edit-btn').style.display = 'none';
}

function prepareDeleteRecipe(id) {
    recipeToDeleteId = id;
    myRecipesModal.show();
}

function confirmDeleteRecipe() {
    if (recipeToDeleteId) {
        let recipes = getRecipes();

        const updatedRecipes = recipes.filter(r => r.id !== recipeToDeleteId);

        saveRecipes(updatedRecipes);
        myRecipesModal.hide(); 
        loadMyRecipes(); 
        recipeToDeleteId = null; 
    }
}

