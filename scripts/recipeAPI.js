document.addEventListener('DOMContentLoaded', getQuery);

let searchForm = document.querySelector('#search-form');

// Event listener for search form
function getQuery() {
    document.getElementById('loader').style.display = 'block';

    let query = window.location.search;
    let urlParams = new URLSearchParams(query);
    let recipe = urlParams.get('query');
    console.log(recipe+" is the recipe");
    fetchRecipes(recipe);
};

// Fetch recipes from API
function fetchRecipes(recipe) {
    let apiKey ='135c36155bd23b962aa9e0a9addb3b05'; 
    let apiId= '580529d7';
    // Using a proxy to avoid CORS error
    var proxyUrl =  'https://afternoon-badlands-11870.herokuapp.com/'; 
    let url = 'https://api.edamam.com/api/recipes/v2';
    fetch(proxyUrl+url+`?type=public&q=${recipe}&app_id=${apiId}&app_key=${apiKey}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response=>{
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        // parses response to json if successful
        console.log(response, 'response');
        return response.json();
    }).then(data=>{
        displayRecipes(data);
        document.getElementById('loader').style.display = 'none';

    }).catch(error=>{
        console.log('There was a problem with your fetch operation:', error);
        document.getElementById('loader').style.display = 'none';

    });

};
// display recipe by mapping through the data
function displayRecipes(data) {
    let results = data.hits;
    console.log(results, 'recipes');
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    let recipeContainer = document.getElementById('results-container');
    recipeContainer.innerHTML = '';

    let recipeElements = results.map(function(result) {
        let truncatedIngredients = truncateText(result.recipe.ingredientLines, 100); 
        let isSaved = savedRecipes.includes(result.recipe.uri);
        let heartColor = isSaved ? 'red' : 'black';
        return `
        <div class="card" data-uri="${result.recipe.uri}" style="width: 18rem;">
            <img src="${result.recipe.image}" class="card-img-top" alt="${result.recipe.label}">
            <div class="card-body">
                <h5 class="card-title">${result.recipe.label}</h5>
                <p class="card-text">${truncatedIngredients}</p>
                <div class="card-actions">
                    <button class="btn btn-primary learn-more" data-uri="${result.recipe.uri}">Learn More</button>
                    <p class="heart"style="color: ${heartColor};" data-uri="${result.recipe.uri}">&#x2764;</p>
                </div>
            </div>
        </div>`;
    });
    recipeContainer.innerHTML = recipeElements.join('');
   
    // using dynamic event listener to handle click events on the recipe card itself
    recipeContainer.addEventListener('click', function(e) {
        let target = e.target; 
    
        if(target.matches('.learn-more')) {
            e.preventDefault();
            const uri = target.getAttribute('data-uri');
            localStorage.setItem('currentRecipe', uri);
            window.location.href = `recipeDetails.html`;
        } else if (target.classList.contains('heart') || target.closest('.heart')) {
    
            e.preventDefault();
           
            if (!target.classList.contains('heart')) {
                target = target.closest('.heart');
            }
            const recipeURI = target.getAttribute('data-uri');
            let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
            
            if(savedRecipes.includes(recipeURI)) {
                // If already saved, remove it and change heart to black
                savedRecipes = savedRecipes.filter(uri => uri !== recipeURI);
                target.style.color = 'black'; 
                target.classList.remove('heart-saved');
            } else {
                // If not saved, add it and change heart to red
                savedRecipes.push(recipeURI);
                target.style.color = 'red'; 
                target.classList.add('heart-saved');
            }
            
            localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        }
    });
    
}

// for truncating text that is too long
function truncateText(textArray, maxLength) {
    let text = textArray.join(', ');
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "..."; 
    }
    return text;
}
