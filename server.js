import express from "express"
import path from "path"
import axios from "axios"
import fetch from "node-fetch"

import search from "./app/routes/search.js"
import database from "./controllers/request_database.js"
import router from "router"

const app = express();
const port = 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/axios', express.static(path.join(__dirname, 'node_modules/axios/dist')));
app.use("/search", search);
app.use("/request_database", database);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

