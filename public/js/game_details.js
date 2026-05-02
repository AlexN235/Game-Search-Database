// Javascript for frontend of search webpage

// globals
const query = window.location.href.split("/search/game/");
const game_name = document.querySelector('.game-name-info');
const game_rating = document.querySelector('.game-rating-info');
const game_genre = document.querySelector('.game-genre-info');
const game_summary = document.querySelector('.game-summary-info');
const game_platforms = document.querySelector('.game-platforms-info');
const game_engines = document.querySelector('.game-engines-info');
const game_keywords = document.querySelector('.game-keywords-info');
const game_cover = document.querySelector('.game-cover-img');

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
        if(result.rating) game_rating.innerHTML = result.rating;
        if(result.summary) game_summary.innerHTML = result.summary;
        
        // Multiple outputs
        if(result.genres && result.genres.length>0) game_genre.innerHTML = result.genres;
        if(result.platforms && result.platforms.length>0) game_platforms.innerHTML = result.platforms;
        if(result.engines && result.engines.length>0) game_engines.innerHTML = result.engines; 
        if(result.keywords && result.keywords.length>0) game_keywords.innerHTML = result.keywords;
        if(result.cover) { 
            game_cover.src = result.cover;

        }

    } catch (error) {
        console.error(error.message);
        console.log("error in here");
    }
}

loadPage()
