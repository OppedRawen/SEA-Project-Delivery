document.addEventListener('DOMContentLoaded', function(){
    let form = document.getElementById('search-form');
    let input = document.getElementById('search-input');
    form.addEventListener('submit',function(e){
        e.preventDefault();
        let recipes = input.value.trim();
        if(recipes){
          window.location.href = `resultPage.html?query=${recipes}`;
        }else{
            alert('Please enter a recipe');
        }
    })
});

// function searchRecipes(){
//     let form = document.getElementById('search-form');
//     let input = document.getElementById('search-input');
//     form.addEventListener('submit',function(e){
//         e.preventDefault();
//         let recipes = input.value.trim();
//         if(recipes){
//           window.location.href = `resultPage.html?query=${recipes}`;
//         }else{
//             alert('Please enter a recipe');
//         }
//     })
// }