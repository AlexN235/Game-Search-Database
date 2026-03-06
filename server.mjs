import express from "express"
import path from "path"
import axios from "axios"
import fetch from "node-fetch"
import fs from "fs"

const app = express();
const port = 3000;
const __dirname = path.resolve();


app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});

//app.use('/static', express.static(path.join(__dirname, 'public')))

function startUp() {
    const fp = "twitchtokens.txt";
    const data = fs.readFileSync(fp, 'utf8')
    let lines = data.split(/[\r?\n ]/);
    return lines
}

function getAccess(secret) {
    axios.post("https://id.twitch.tv/oauth2/token", {
        client_id: clientID,
        client_secret: secret, 
        grant_type: 'client_credentials', 
    })
    .then(async function (response) {
        let accessToken = await response.data.access_token;
        return accessToken;  
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(() => {
        //console.log(accessToken);
    })
}

function getGame(id) {
    if(accessToken == '')
        return
    const header = {
            'Client-ID': clientID,
            'Authorization': `Bearer ${accessToken}`,
        }
    let res = axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: header,
        data: `fields *; where id = ${id}; limit 2;`
        });
    return res;
}

const keys = startUp();
const clientID = keys[1]
const accessToken = getAccess(keys[4])



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

