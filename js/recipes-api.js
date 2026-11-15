
// ==========================================
// H&M BAKERY - REAL DESSERT RECIPES
// TheMealDB External API
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    const recipesGrid = document.querySelector('#recipes-grid');
    const statusMessage = document.querySelector('#recipes-status');
    const retryButton = document.querySelector('#retry-recipes');

    if (!recipesGrid || !statusMessage || !retryButton) {
        return;
    }

    const API_URL =
        'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert';

    // Create an element safely
    function createElement(tag, className, content) {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = content;
        return element;
    }

    // Load full recipe details by ID
    async function loadRecipeDetails(mealId, detailsContainer) {

        detailsContainer.replaceChildren(
            createElement('p', 'text-muted', 'Loading recipe details...')
        );

        try {

            const response = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(mealId)}`
            );

            if (!response.ok) {
                throw new Error('Could not load recipe details.');
            }

            const data = await response.json();

            if (!data.meals || !data.meals.length) {
                throw new Error('Recipe details are unavailable.');
            }

            const meal = data.meals[0];

            detailsContainer.replaceChildren();

            // Ingredients heading
            detailsContainer.appendChild(
                createElement('h4', 'h6 mt-3', 'Ingredients')
            );

            const ingredientsList = document.createElement('ul');
            ingredientsList.className = 'recipe-ingredients';

            // Get ingredients and measurements
            for (let i = 1; i <= 20; i++) {

                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];

                if (ingredient && ingredient.trim()) {

                    const item = document.createElement('li');

                    item.textContent =
                        `${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`;

                    ingredientsList.appendChild(item);
                }
            }

            detailsContainer.appendChild(ingredientsList);

            // Instructions heading
            detailsContainer.appendChild(
                createElement('h4', 'h6 mt-4', 'Preparation Instructions')
            );

            const instructions = createElement(
                'p',
                'recipe-instructions',
                meal.strInstructions || 'Instructions are unavailable.'
            );

            detailsContainer.appendChild(instructions);

            // Optional video link
            if (meal.strYoutube) {

                const videoLink = document.createElement('a');

                videoLink.href = meal.strYoutube;
                videoLink.target = '_blank';
                videoLink.rel = 'noopener noreferrer';
                videoLink.textContent = 'Watch Preparation Video';

                detailsContainer.appendChild(videoLink);
            }

        } catch (error) {

            console.error('Recipe Details Error:', error);

            detailsContainer.replaceChildren(
                createElement(
                    'p',
                    'text-danger',
                    'Unable to load this recipe. Please try again.'
                )
            );

        }
    }

    // Create recipe card
    function createRecipeCard(meal) {

        const column = document.createElement('div');
        column.className = 'col';

        const card = document.createElement('article');
        card.className = 'card bs-card h-100 recipe-card';

        const image = document.createElement('img');
        image.src = meal.strMealThumb;
        image.alt = meal.strMeal;
        image.className = 'card-img-top';
        image.loading = 'lazy';

        const body = document.createElement('div');
        body.className = 'card-body d-flex flex-column';

        const title = createElement(
            'h3',
            'card-title h5',
            meal.strMeal
        );

        const description = createElement(
            'p',
            'card-text',
            'Discover the ingredients and preparation steps for this dessert.'
        );

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-primary mt-auto';
        button.textContent = 'View Recipe';
        button.setAttribute('aria-expanded', 'false');

        const details = document.createElement('div');
        details.className = 'recipe-details mt-3';
        details.id = `recipe-details-${meal.idMeal}`;
        button.setAttribute('aria-controls', details.id);
        details.setAttribute('aria-live', 'polite');
        details.hidden = true;

        let isLoaded = false;

        button.addEventListener('click', async () => {

            if (!details.hidden) {
                details.hidden = true;
                button.setAttribute('aria-expanded', 'false');
                button.textContent = 'View Recipe';
                return;
            }

            details.hidden = false;
            button.setAttribute('aria-expanded', 'true');
            button.textContent = 'Hide Recipe';

            if (!isLoaded) {
                await loadRecipeDetails(meal.idMeal, details);
                isLoaded = true;
            }

        });

        body.appendChild(title);
        body.appendChild(description);
        body.appendChild(button);
        body.appendChild(details);

        card.appendChild(image);
        card.appendChild(body);

        column.appendChild(card);

        return column;
    }

    // Load dessert recipes
    async function loadRecipes() {

        statusMessage.textContent = 'Loading delicious recipes...';
        statusMessage.style.display = 'block';

        recipesGrid.replaceChildren();
        retryButton.hidden = true;

        try {

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.meals || data.meals.length === 0) {
                throw new Error('No recipes found.');
            }

            const recipes = data.meals.slice(0, 6);

            recipes.forEach(meal => {
                recipesGrid.appendChild(createRecipeCard(meal));
            });

            statusMessage.textContent =
                `Successfully loaded ${recipes.length} dessert recipes!`;

        } catch (error) {

            console.error('Recipes API Error:', error);

            statusMessage.textContent =
                'Unable to load recipes. Please check your internet connection.';

            retryButton.hidden = false;

        }
    }

    // Retry button
    retryButton.addEventListener('click', loadRecipes);

    // Initialize
    loadRecipes();

});
