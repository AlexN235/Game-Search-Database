// request_database.js 
import express from "express"
import path from "path"
import fs from "fs"
import axios from "axios"

const database = express.Router();
const __dirname = path.resolve();

const databaseNames = ["genres", "game_engines", "platforms", "videos", "keywords"];

const databaseNamesToTable = new Map([
    ["genres", "genres"],
    ["game_engines", "game_engines"],
    ["platforms", "platform_types"],
    ["videos", "game_videos"],
    ["keywords", "keywords"],
    ["cover", "covers"]
]) 

const databaseTables = new Map([
    ["genres", new Map()],
    ["game_engines", new Map()],
    ["platforms", new Map()],
    ["videos", new Map()],
    ["keywords", new Map()],
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

database.post('/game_info', async (req, res) => {
    const id = req.body.id;
    try {
        // API request: name, rating, summary, genre, platform, engine, keywords
        const queriedInfo = await getGameById(id);
        const gameStats = queriedInfo.data[0];
        
        for(const category of databaseNames) {
            const info = await getFieldsFromID(category, gameStats[category]);
            gameStats[category] = info.map((n) => (n.name));
        }
        
        
        // API request: cover
        const coverInfo = await getFieldFromID("cover", gameStats["id"]);
        let coverURL = coverInfo[0].url.split("t_thumb");
        gameStats["cover"] = coverURL[0] + "t_720p" + coverURL[1];
        
        // API request: videos
        const videoInfo = await getFieldFromID("videos", gameStats["id"]);
        const videoURL = `https://www.youtube.com/embed/${videoInfo[0].video_id}`;
        gameStats["videos"] = videoURL;
        
        // Send response
        res.status(200);
        res.json({ 
            name : gameStats['name'],
            rating : gameStats['rating'],
            summary : gameStats['summary'],
            genres : gameStats['genres'],
            cover : gameStats['cover'],
            platforms : gameStats['platforms'],
            engines : gameStats['game_engines'],
            videos : gameStats['videos'],
            keywords : gameStats['keywords'],
        })
        
        res.send()
    } catch {
        console.log("failed to retrieve data from database.");
    } 
})

async function getFieldsFromID(category, ids) {
    if(!databaseTables.has(category)) 
        return;
    if(accessToken == '')
        return;
    
    let IDList = ""
    for(const id of ids) {
        IDList += id + ",";
    }
    IDList = IDList.slice(0, -1);
    
    const header = {
            'Client-ID': clientID,
            'Authorization': `Bearer ${accessToken}`,
        }
    let res;
    try {
        res = await axios({
            url: `https://api.igdb.com/v4/${databaseNamesToTable.get(category)}`,
            method: 'POST',
            headers: header,
            data: `fields name; where id=(${IDList});`
        });
    } catch {
        console.log(`Failed to get chart: ${category}`);
    }
    return res.data;
}

async function getFieldFromID(category, id) {
    if(accessToken == '')
        return;
1
    const header = {
            'Client-ID': clientID,
            'Authorization': `Bearer ${accessToken}`,
        }
    let res;
    try {
        res = await axios({
            url: `https://api.igdb.com/v4/${databaseNamesToTable.get(category)}`,
            method: 'POST',
            headers: header,
            data: `fields *; where game=${id};`
        });
    } catch {
        console.log(`Failed to get chart: ${category}`);
    }
    return res.data;
}

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
            data: `fields name, id, rating, summary, genres, keywords, cover, game_engines, platforms, videos; where id=${gameID}; limit 1;` // change this to use id
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
            data: 'fields name; limit 400;'
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