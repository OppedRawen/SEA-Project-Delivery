document.addEventListener('DOMContentLoaded', function(){
    // Get the recipe data from localStorage
let recipeDataString = localStorage.getItem('currentRecipe');
if(recipeDataString){
fetchRecipeDetails(recipeDataString);
localStorage.removeItem('currentRecipe');
console.log(recipeDataString);
}else{
    console.log('No recipe data found');

}

});
// fetch recipe details by uri
function fetchRecipeDetails(recipeURL) {
    let apiKey = '135c36155bd23b962aa9e0a9addb3b05'; 
    let apiId = '580529d7';
    var proxyUrl = 'https://afternoon-badlands-11870.herokuapp.com/';
    // Assuming recipeURL is the complete URI received from localStorage and needs to be encoded
    let encodedUri = encodeURIComponent(recipeURL);
//  using proxyUrl to avoid CORS error
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
    })
    .then(data => {
        console.log(data, 'data');
        displayRecipeDetails(data);
    })
    .catch(error => {
        console.log('There was a problem with your fetch operation:', error);
    });
}


function displayRecipeDetails(data) {
    let recipe = data.hits[0].recipe; 
    let recipeContainer = document.getElementById('recipe-detail-container');

    // Dynamically generate DietLabels and TotalNutrients content
    let dietLabels = recipe.dietLabels.join(', ');
    let cuisineType = recipe.cuisineType.join(', ');
    let nutrients = Object.keys(recipe.totalNutrients).map(key => {
        return `<li>${recipe.totalNutrients[key].label}: ${recipe.totalNutrients[key].quantity.toFixed(2)} ${recipe.totalNutrients[key].unit}</li>`;
    }).join('');

    // Building the HTML string using template literals
    let recipeElement = `
    <div class="container mt-4">
    <img src="${recipe.image}" class="card-img-top" alt="${recipe.label}">
    <h5 class="card-title">${recipe.label}</h5>
    <p><strong>Calories:</strong> ${recipe.calories.toFixed(2)}</p>
        <div class="row">
            <div class="col-md-6">
                <div class="card" style="width: 100%;">
                    
                    <div class="card-body">
                       <h5>Recipe Ingredients</h5>
                        <p class="card-text">${recipe.ingredientLines.join(', ')}</p>
                        <a href="${recipe.url}" class="btn btn-primary link" target="_blank">Link to Recipe</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <h4>Details</h4>
                <p><strong>Cuisine Type:</strong> ${cuisineType}</p>
                <p><strong>Diet Labels:</strong> ${dietLabels}</p>
                <p><strong>Source:</strong> ${recipe.source}</p>
                
            </div>
            <h5>Total Nutrients</h5>
                <ul>${nutrients}</ul>
        </div>
    </div>`;

    recipeContainer.innerHTML = recipeElement;
}
