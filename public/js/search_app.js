// Javascript for frontend of search webpage

// globals
const query = window.location.href.split("?");
const game_name = window.querySelectorAll('.game-name-info');

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
        console.log(result);
        return result;
    } catch (error) {
        console.error(error.message);
        console.log("error in here");
    }
}

const page_info = loadPage()
console.log("starting")
console.log(page_info)