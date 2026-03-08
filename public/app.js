// Javascript for frontend of webpage
const searchBtn = document.querySelector('.submit-btn');
const searchBar = document.getElementById('search-bar');

searchBtn.addEventListener('click', GameSearch);

function GameSearch() {
    const textValue = searchBar.value;
    //console.log(window.location.href)
    window.location.href = window.location.href + 'search.html';
}