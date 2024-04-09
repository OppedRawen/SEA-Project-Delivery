document.addEventListener('DOMContentLoaded', getQuery);

let searchForm = document.querySelector('#search-form');

function getQuery() {
    document.getElementById('loader').style.display = 'block';

    let query = window.location.search;
    let urlParams = new URLSearchParams(query);
    let recipe = urlParams.get('query');
    console.log(recipe+" is the recipe");
    fetchRecipes(recipe);
};

function fetchRecipes(recipe) {
    let apiKey ='135c36155bd23b962aa9e0a9addb3b05'; 
    let apiId= '580529d7';
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
        // not the actual data we need yet
        console.log(response, 'response');
        return response.json();
    }).then(data=>{
        console.log(data, 'data');
        displayRecipes(data);
        document.getElementById('loader').style.display = 'none';

    }).catch(error=>{
        console.log('There was a problem with your fetch operation:', error);
        document.getElementById('loader').style.display = 'none';

    });

};

function displayRecipes(data) {
    let results = data.hits;
    console.log(results, 'recipes');
    let recipeContainer = document.getElementById('results-container');
    recipeContainer.innerHTML = '';

    let recipeElements = results.map(function(result) {
        let truncatedIngredients = truncateText(result.recipe.ingredientLines, 100); 

        return `
        <div class="card" data-uri="${result.recipe.uri}" style="width: 18rem;">
            <img src="${result.recipe.image}" class="card-img-top" alt="${result.recipe.label}">
            <div class="card-body">
                <h5 class="card-title">${result.recipe.label}</h5>
                <p class="card-text">${truncatedIngredients}</p>
                <div class="card-actions">
                    <button class="btn btn-primary learn-more" data-uri="${result.recipe.uri}">Learn More</button>
                    <span class="heart" data-uri="${result.recipe.uri}">&#x2764;</span>
                </div>
            </div>
        </div>`;
    });
    recipeContainer.innerHTML = recipeElements.join('');
   
    recipeContainer.addEventListener('click', function(e) {
        let target = e.target; // Define target here based on the event's target
    
        if(target.matches('.learn-more')) {
            e.preventDefault();
            const uri = target.getAttribute('data-uri');
            localStorage.setItem('currentRecipe', uri);
            window.location.href = `recipeDetails.html`;
        } else if (target.classList.contains('heart') || target.closest('.heart')) {
            // Adjusted the condition to use target and also check if the clicked element is inside a heart icon
            e.preventDefault();
            // If clicking inside heart icon, adjust target to the closest heart icon
            if (!target.classList.contains('heart')) {
                target = target.closest('.heart');
            }
            const recipeURI = target.getAttribute('data-uri');
            let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
            
            if(savedRecipes.includes(recipeURI)) {
                // If already saved, remove it
                savedRecipes = savedRecipes.filter(uri => uri !== recipeURI);
                target.style.color = ''; 
            } else {
                // If not saved, add it
                savedRecipes.push(recipeURI);
                target.style.color = 'red'; 
                console.log(target.style.color, 'color')
            }
            
            localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        }
    });
    
}


function truncateText(textArray, maxLength) {
    let text = textArray.join(', ');
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "..."; // Subtract 3 to accommodate the ellipsis
    }
    return text;
}
