// Javascript for frontend of search webpage

// globals
const query = window.location.href.split("?");
const game_list = document.querySelector('.result-list');

const data = {
    search: (window.location.href.split("=")[1]),
}

async function loadPage() {
    const url = query[0] + "/query_name";
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
            game_list.innerHTML += `\
            <li class="search-node">\
                <a href=search/game/${ids[i]}>\
                    <h4 class="item-name"> ${names[i]} </h4>\
                </a>\
                <div class="item-description"> ${ids[i]} </div>\
            </li>\
        `;
        }
        
    } catch (error) {
        console.error(error.message);
        console.log("error in here");
    }
}

loadPage()
