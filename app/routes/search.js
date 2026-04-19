import express from "express"
import path from "path"
import fs from "fs"
import axios from "axios"

const search = express.Router();
const __dirname = path.resolve();

let genre_table = new Map();

search.get('/', async (req, res) => {
    res.sendFile('public/search_results.html', {root: __dirname});
});

search.post('/query_name', async (req, res) => {
    // Search for game based on id
    let data;
    try {
        data = await req.body;
        const gameInfo = await getGameName(data.search.replaceAll("%20", " "));
        
        // PROCESS DATA TO SEND BACK IN RESPONSE
        const raw_data = gameInfo.data;
        //console.log(raw_data);
        let game = [];
        let id = [];
        for(const d of raw_data) {
            id.push(d.id);
            game.push(d.game);
        }

        // Send response
        res.status(200);
        res.json({ 
            name : game,
            id : id,
        })
        res.send()
    } catch {
        console.log("failed to retrieve data from database.");
    } 
})

search.post('/DB', async (req, res) => {
    // Make table for genre (id, name)
    try {
        const table = await getChart();
        for(const gen of table.data)
            genre_table.set(gen['id'], gen['name']);
    } catch {
        console.log("getting table FAILED")
    }
    
    // Search for game based on id
    let data;
    try {
       
        data = await req.body;
        const gameInfo = await getGame(data.search.replaceAll("%20", " "));
        
        // PROCESS DATA TO SEND BACK IN RESPONSE
        const raw_data = gameInfo.data[0];
        const genre = [];
        for(const i of raw_data.genres) 
            genre.push(genre_table.get(i));

        // Send response
        res.status(200);
        res.json({ 
            name : raw_data['name'],
            rating : raw_data['rating'],
            summary : raw_data['summary'],
            genre : genre,
        })
        res.send()
    } catch {
        console.log("failed to retrieve data from database.");
    } 
})

function startUp() {
    const fp = "twitchtokens.txt";
    const data = fs.readFileSync(fp, 'utf8')
    let lines = data.split(/[\r?\n ]/);
    return lines
}

async function setUp(secret) {
    let res;
    try {
        res = await axios.post("https://id.twitch.tv/oauth2/token", {
        client_id: clientID,
        client_secret: secret, 
        grant_type: 'client_credentials', 
        })
    } catch {
        console.log("Could not get access token");
    }
    return res.data.access_token;
} 

async function getAccess(secret) {
    axios.post("https://id.twitch.tv/oauth2/token", {
        client_id: clientID,
        client_secret: secret, 
        grant_type: 'client_credentials', 
    })
    .then(async function (response) {
        return response.data.access_token;
        
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(() => {
        //console.log(accessToken);
    })
}

async function getGame(gameName) {
    if(accessToken == '')
        return
    const header = {
            'Client-ID': clientID,
            'Authorization': `Bearer ${accessToken}`,
        }
    let res;
    try {
        res = await axios({
            url: "https://api.igdb.com/v4/games",
            method: 'POST',
            headers: header,
            data: `fields name, rating, summary, genres; search "${gameName}"; limit 1;`
        });
    } catch {
        console.log("failed to get game data")
    }
    return res;
}

async function getGameName(gameName) {
    if(accessToken == '')
        return
    const header = {
            'Client-ID': clientID,
            'Authorization': `Bearer ${accessToken}`,
        }
    let res;
    try {
        res = await axios({
            url: "https://api.igdb.com/v4/games",
            method: 'POST',
            headers: header,
            data: `fields name; search "${gameName}"; limit 10;`
        });
    } catch {
        console.log("failed to get game data")
    }
    return res;
}

async function getChart() {
    if(accessToken == '')
        return
    const header = {
            'Client-ID': clientID,
            'Authorization': `Bearer ${accessToken}`,
        }
    let res;
    try {
        res = await axios({
            url: "https://api.igdb.com/v4/genres",
            method: 'POST',
            headers: header,
            data: 'fields name;'
            
            // url: "https://api.igdb.com/v4/age_ratings",
            // method: 'POST',
            // headers: header,
            // headers: header,
            // data: 'fields rating_category;'
            
            // url: "https://api.igdb.com/v4/age_rating_categories",
            // method: 'POST',
            // headers: header,
            // data: 'fields rating, organization, checksum;'
        });
    } catch {
        console.log("failed to get game chart")
    }
    return res;
}

const keys = startUp();
const clientID = keys[1]
const accessToken = await setUp(keys[4])

export default search;