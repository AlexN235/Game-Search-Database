// Javascript for frontend of search webpage

// globals
const query = window.location.href.split("/search");
const game_list = document.querySelector('.result-list');
const mouseOverHightlightColor = 'lightgrey';

//globals - functionality
const search_text = document.querySelector('.nav-bar-search-input');
const search_btn = document.querySelector('.nav-bar-search-button');
search_btn.addEventListener('click', goToSearch);

function goToSearch() {
    const textValue = search_text.value;
    
    if(textValue != "") {
        window.location.href = '/search' + `?q=${textValue}`;
    }
}

function mouseHighlight() {
    event.target.style.backgroundColor = mouseOverHightlightColor;
}

function mouseUnhighlight() {
    event.target.style.backgroundColor = '';
}

function goToPage(gameID) {
    window.location.href = `/search/game/${gameID}`;
}

const data = {
    search: (window.location.href.split("=")[1]),
}

async function loadPage() {
    const url = query[0] + "/request_database/query_name";
    try {
        const response = await axios.post(url, data);
        if(response.statusText != "OK") {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.data;
        
        // Take data and put it into the page.
        const names = result.name;
        const ids = result.id;
        
        game_list.innerHTML = "";
        for(let i=0; i<names.length; i++) {
            const newItem = document.createElement('li');
            newItem.classList.add("search-node");
            newItem.innerHTML += `\
                <a href=search/game/${ids[i]}>\
                    <h4 class="item-name"> ${names[i]} </h4>\
                </a>\
                <div class="item-description"> ${ids[i]} </div>\
                `;
            newItem.addEventListener('mouseenter', mouseHighlight);
            newItem.addEventListener('mouseleave', mouseUnhighlight);
            newItem.addEventListener('click', () => { goToPage(ids[i]) });
            game_list.appendChild(newItem);
        }
        
    } catch (error) {
        console.error(error.message);
        console.log("error in here");
    }
}



loadPage()
