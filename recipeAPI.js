document.addEventListener('DOMContentLoaded', getQuery);
document.addEventListener('DOMContentLoaded', fetchRecipes);
function getQuery() {
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
    }).catch(error=>{
        console.log('There was a problem with your fetch operation:', error);
    });

};

function displayRecipes(data) {
    let recipe = data.hits;
    console.log(recipe);
    let recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = '';
    const templateCard = document.querySelector(".card");
    for (let i = 0; i < recipe.length; i++) {
        let title = recipe[i].recipe.label;
        let imageURL = recipe[i].recipe.image;
        let ingredients = recipe[i].recipe.ingredientLines;
        let url = recipe[i].recipe.url;
        const nextCard = templateCard.cloneNode(true);
        editCardContent(nextCard, title, imageURL, ingredients, url);
        recipeContainer.appendChild(nextCard);
    }
}