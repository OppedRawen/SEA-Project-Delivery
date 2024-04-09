document.addEventListener('DOMContentLoaded', getQuery);

let searchForm = document.querySelector('#search-form');

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
    let results = data.hits;
    console.log(results, 'recipes');
    let recipeContainer = document.getElementById('results-container');
    recipeContainer.innerHTML = '';

    let recipeElements = results.map(function(result) {
      
        return `
        <div class="card" data-uri=${result.recipe.uri} style="width: 18rem;">
  <img src="${result.recipe.image}"class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${result.recipe.label}</h5>
    <p class="card-text">${result.recipe.ingredientLines.join(', ')}</p>
    <a href="${result.recipe.url}" class="btn btn-primary">Link to Recipe</a>
    <span class="heart" data-uri="${result.recipe.uri}">&#x2764;</span>
  </div>
</div>`
    });
    recipeContainer.innerHTML = recipeElements.join('');
   

    recipeContainer.addEventListener('click', function(e){
        // let targetCard = e.target.closest('.card');
      
        // if(targetCard){
        //     e.preventDefault();
        //     let recipeURI= targetCard.getAttribute('data-uri');
        //     localStorage.setItem('recipeURL', recipeURI);
        //     console.log(recipeURI);
        // // Assuming you want to pass the recipe URL or any other simple attribute
        // window.location.href = `recipeDetails.html`;
        // }

        if(e.target.classList.contains('heart')){
            e.preventDefault();
            let recipeURI= e.target.getAttribute('data-uri');
            console.log(recipeURI);
            let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
            if(!savedRecipes.includes(recipeURI)){
                savedRecipes.push(recipeURI);
                localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
                console.log('Recipe saved');
                e.target.style.color = 'red';
            }
        }
}


)
}


