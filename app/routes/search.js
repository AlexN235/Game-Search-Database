import express from "express"

const search = express.Router();

search.get("/", (req, res) => {
    res.sendFile('public/search.html', {root: __dirname});
});

export default search;