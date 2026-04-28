// request_database.js 
import express from "express"
import path from "path"
import fs from "fs"
import axios from "axios"

const database = express.Router();
const __dirname = path.resolve();

let genre_table = new Map();
let engines_table = new Map();
let keywords_table = new Map();
let platforms_table = new Map();
let videos_table = new Map();

const database_names = ["genres", "game_engines", "platform_types", "game_videos", "keywords"];

const database_tables = new Map([
    ["genres", genre_table],
    ["game_engines", engines_table],
    ["platform_types", platforms_table],
    ["game_videos", videos_table],
    ["keywords", keywords_table],
    ]);
   
database.post('/query_name', async (req, res) => {
    // Search for game based on id
    let data;
    try {
        data = await req.body;
        const gameInfo = await getGameByName(data.search.replaceAll("%20", " "));
        
        // PROCESS DATA TO SEND BACK IN RESPONSE
        const raw_data = gameInfo.data;
        let game = [];
        let id = [];
        //console.log(gameInfo);
        for(const d of raw_data) {
            id.push(d.id);
            game.push(d.name);
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

// Helper function to populate tables from igdb to define ids to names.
async function fillTables() {
    let table
    for(const name of database_names) {
        try {
            table = await getChart(name);
            for(const entry of table.data) 
                database_tables.get(name).set(entry['id'], entry['name']);
        } catch {
            console.log(`${name} table query fail`)
        }
    }
}

database.post('/game_info', async (req, res) => {
    const id = req.body.id;
    // Get table data.
    try {
        await fillTables();
    } catch {
        console.log("getting table FAILED")
    }
    
    // Search for game based on id
    let data;
    try {
       
        data = await req.body;
        const gameInfo = await getGameById(id);
        
        // PROCESS DATA TO SEND BACK IN RESPONSE
        const raw_data = gameInfo.data[0];
        const genre = [];
        for(const i of raw_data.genres) 
            genre.push(genre_table.get(i));
        
        //console.log(raw_data);

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

async function getGameById(gameID) {
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
            data: `fields name, id, rating, summary, genres, keywords, cover, game_engines, platforms, videos ; where id=${gameID}; limit 1;` // change this to use id
        });
    } catch {
        console.log("failed to get game data")
    }
    return res;
}

async function getGameByName(gameName) {
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
            data: `fields *; search "${gameName}"; limit 20;`
        });
    } catch {
        console.log("failed to get game data")
    }
    return res;
}

async function getGenreChart() {
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

async function getChart(dbName) {
    if(!database_tables.has(dbName)) 
        return;
    if(accessToken == '')
        return;
    
    const header = {
            'Client-ID': clientID,
            'Authorization': `Bearer ${accessToken}`,
        }
    let res;
    try {
        res = await axios({
            url: `https://api.igdb.com/v4/${dbName}`,
            method: 'POST',
            headers: header,
            data: 'fields name;'
        });
    } catch {
        console.log(`Failed to get chart: ${dbName}`);
    }
    return res;
}

const keys = startUp();
const clientID = keys[1]
const accessToken = await setUp(keys[4])

export default database;