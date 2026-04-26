// Javascript for frontend of webpage
const searchBtn = document.querySelector('.submit-btn');
const searchBar = document.getElementById('search-bar');

searchBtn.addEventListener('click', GameSearch);

function GameSearch() {
    const textValue = searchBar.value;
    window.location.href = window.location.href + 'search' + `?q=${textValue}`;
}