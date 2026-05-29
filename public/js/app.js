// Javascript for frontend of webpage
const searchBtn = document.querySelector('.main-search-submit-btn');
const searchBar = document.getElementById('search-bar');

//globals - functionality
const search_text = document.querySelector('.nav-bar-search-input');
const search_btn = document.querySelector('.nav-bar-search-button');
search_btn.addEventListener('click', goToSearch);

function goToSearch() {
    const textValue = search_text.value;
    
    if(textValue != "") {
        window.location.href = 'search' + `?q=${textValue}`;
    }
}

searchBtn.addEventListener('click', GameSearch);

function GameSearch() {
    const textValue = searchBar.value;
    window.location.href = window.location.href + 'search' + `?q=${textValue}`;
}