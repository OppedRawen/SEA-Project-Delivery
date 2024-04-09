document.addEventListener('DOMContentLoaded', () => {
    const savedRecipesContainer = document.getElementById('saved-recipes-container');
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    console.log(savedRecipes);
    if (savedRecipes.length === 0) {
        savedRecipesContainer.innerHTML = '<p>No saved recipes found.</p>';
        return;
    }

    savedRecipes.forEach(uri => {
    
        let apiKey = '135c36155bd23b962aa9e0a9addb3b05'; 
        let apiId = '580529d7';
        var proxyUrl = 'https://afternoon-badlands-11870.herokuapp.com/';
        let encodedUri = encodeURIComponent(uri);
        // Assuming recipeURL is the complete URI received from localStorage and needs to be encoded
       
        // Simplified and corrected fetch URL
        let fetchUrl = `${proxyUrl}https://api.edamam.com/api/recipes/v2/by-uri?type=public&uri=${encodedUri}&app_id=${apiId}&app_key=${apiKey}`;

        fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        }
        )
        .then(data => {
            console.log(data, 'data');
        fetchRecipeDetails(data,savedRecipesContainer);
        }
        )
        .catch(error => {
            console.log('There was a problem with your fetch operation:', error);
        });
    });
});

function fetchRecipeDetails(data,savedRecipesContainer) {
    let recipe = data.hits[0].recipe; 
   
    const cardHtml = `
        <div class="card">
            <img src="${recipe.image}" alt="${recipe.label}">
            <div class="card-body">
                <h5>${recipe.label}</h5>
                <button class="btn learn-more" data-uri="${recipe.uri}">Learn More</button>
                <button class="btn delete-recipe" data-uri="${recipe.uri}">Delete</button>
            </div>
        </div>
    `;

    // Append the new card to the container
    savedRecipesContainer.innerHTML += cardHtml;
   
        savedRecipesContainer.addEventListener('click', function(e) {
            const uri = e.target.getAttribute('data-uri');

            if (e.target.matches('.learn-more')) {
                e.preventDefault();
                // Store the URI or full recipe data as needed
                localStorage.setItem('currentRecipe', uri); // Adjust based on your needs
                
                // Navigate to the details page
                window.location.href = `recipeDetails.html`;
            }else if(e.target.matches('.delete-recipe')){
                e.preventDefault();
                deleteRecipe(uri);
                e.target.closest('.card').remove();
            }
        });

}
function deleteRecipe(uri){
    let savedRecipes=JSON.parse(localStorage.getItem('savedRecipes')) || [];
    savedRecipes = savedRecipes.filter(recipeUri => recipeUri !== uri);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
}
