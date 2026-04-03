import express from "express"
import path from "path"
import fs from "fs"
import axios from "axios"

const search = express.Router();
const __dirname = path.resolve();

let genre;

   

search.get('/', async (req, res) => {
    // const searchTerm = req.query.q;
    // let temp;
    // try {
        // temp = await getGame(searchTerm);
    // } catch {
        // console.log("please no error")
    // } 
    
    res.sendFile('public/search.html', {root: __dirname});
    console.log("get");
    // console.log(temp.data[0]);
});

search.post('/DB', async (req, res) => {
    let data;
    console.log("in DB")
    try {
        const table = await getChart();
        genre = table.data;
        console.log(genre);
    } catch {
        console.log("getting table FAILED")
    }
    
    
    try {
        data = await req.body;
        //console.log(data.search); // our number to now put into a db search.
        //return data;
        const gameInfo = await getGame(data.search);
        //console.log(gameInfo.data);
        // PROCESS DATA TO SEND BACK IN RESPONSE
        
        res.status(200);
        res.json({ dataToSendBack : data })
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

async function getGame(id) {
    console.log(id);
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
            data: `fields *; where id = ${id}; limit 2;`
        });
    } catch {
        console.log("failed to get game data")
    }
    return res;
}

async function getChart() {
    console.log("GETTING CHART")
    if(accessToken == '')
        return
    const header = {
            'Client-ID': clientID,
            'Authorization': `Bearer ${accessToken}`,
        }
    let res;
    try {
        res = await axios({
            url: "https://api.igdb.com/v4/age_rating_categories",
            method: 'POST',
            headers: header,
            data: 'fields rating;'
            //data: 'fields name;' // for genres
        });
    } catch {
        console.log("failed to get game chart")
    }
    return res;
}

const keys = startUp();
const clientID = keys[1]
const accessToken = await setUp(keys[4])
console.log(accessToken);

export default search;