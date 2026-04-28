// Javascript for frontend of search webpage

// globals
const query = window.location.href.split("/search/game/");
const game_name = document.querySelector('.game-name-info');
const game_rating = document.querySelector('.game-rating-info');
const game_genre = document.querySelector('.game-genre-info');
const game_summary = document.querySelector('.game-summary-info');

async function loadPage() {
    // ############ Deal with null imput :: change the regexp in url or logically here ############
    const gameID = query[1];
    console.log(gameID);
    console.log(query);
    
    const url = query[0] + "/request_database/game_info";
    console.log(url);
    try {
        const response = await axios.post( url, {id: gameID});
        if(response.statusText != "OK") {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.data;
        
        // Set damage on page
        game_name.innerHTML = result.name;
        game_rating.innerHTML = result.rating;
        game_summary.innerHTML = result.summary;
        
        game_genre.innerHTML = "";
        for(const g of result.genre) {
            if(g) {
                if(g != result.genre[0]) game_genre.innerHTML += ", ";
                game_genre.innerHTML += g;
            }
        }
    } catch (error) {
        console.error(error.message);
        console.log("error in here");
    }
}

loadPage()
