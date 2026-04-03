// Javascript for frontend of search webpage
//import axios from "/axios/axios.min.js"; // NEED TO SERVE FILE AND NOT USE RELATIVE PATHS

const query = window.location.href.split("?");

const data = {
    search: (window.location.href.split("=")[1]),
}
async function loadPage() {
    const url = query[0] + "/DB";
    console.log(url, ": We sending")
    try {
        const response = await axios.post(url, data);
        console.log(response.statusText)
        if(response.statusText != "OK") {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.data;
        //console.log(result.dataToSendBack)
    } catch (error) {
        console.error(error.message);
        console.log("error in here");
    }
}

loadPage()