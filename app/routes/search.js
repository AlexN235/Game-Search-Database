import express from "express"
import path from "path"
import fs from "fs"
import axios from "axios"

const search = express.Router();
const __dirname = path.resolve();

search.get('/', async (req, res) => {
    res.sendFile('public/search_results.html', {root: __dirname});
});

search.get('/game{/:id}', async (req, res) => {
    res.sendFile('public/game_details.html', {root: __dirname});
});

export default search;