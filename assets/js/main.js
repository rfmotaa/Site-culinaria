document.addEventListener('DOMContentLoaded', () => {
    const recipeGrid = document.getElementById('recipe-grid');
    if (recipeGrid) {
        loadAllRecipes(); 
        
        const searchInput = document.getElementById('search-input');
        const searchForm = document.getElementById('search-form');
        
        searchInput.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            loadAllRecipes(searchTerm);
        });

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
});

function loadAllRecipes(searchTerm = '') {
    const allRecipes = getRecipes();
    const grid = document.getElementById('recipe-grid');
    const container = document.getElementById('mainContainer');
    grid.innerHTML = '';

    if (allRecipes.length === 0) {
        container.innerHTML = `<h1 class="text-center col-12">Nenhuma receita cadastrada até o momento! </h1>`;
    }

    const filteredRecipes = allRecipes.filter(recipe => {
        const titleMatch = recipe.title.toLowerCase().includes(searchTerm);
        const ingredientsMatch = recipe.ingredients.toLowerCase().includes(searchTerm);
        return titleMatch || ingredientsMatch;
    });

    if (filteredRecipes.length === 0) {
        grid.innerHTML = `<p class="text-center col-12">Nenhuma receita encontrada para "<strong>${searchTerm}</strong>".</p>`;
    };

    filteredRecipes.forEach(recipe => {
        const card = `
            <div class="col">
                <div class="card recipe-card h-100" onclick="showRecipeDetails(${recipe.id})">
                    <img src="${recipe.imageUrl}" class="card-img-top" alt="${recipe.title}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

function showRecipeDetails(id) {
    const recipes = getRecipes();
    const recipe = recipes.find(r => r.id === id);

    if (!recipe) return;

    const users = getUsers();
    const author = users.find(u => u.id === recipe.userId);

    const modalTitle = document.getElementById('recipeModalTitle');
    const modalBody = document.getElementById('recipeModalBody');

    modalTitle.innerText = recipe.title;
    modalBody.innerHTML = `
        <img src="${recipe.imageUrl}" class="img-fluid rounded mb-3" alt="${recipe.title}">
        <p><strong><i class="bi bi-person-circle"></i> Autor:</strong> ${author ? author.username : 'Desconhecido'}</p>
        <p><strong><i class="bi bi-clock"></i> Tempo de Preparo:</strong> ${recipe.prepTime}</p>
        <hr>
        <h5><i class="bi bi-card-checklist"></i> Ingredientes</h5>
        <p style="white-space: pre-wrap;">${recipe.ingredients}</p>
        <hr>
        <h5><i class="bi bi-journal-text"></i> Modo de Preparo</h5>
        <p style="white-space: pre-wrap;">${recipe.instructions}</p>
    `;

    const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
    recipeModal.show();
}