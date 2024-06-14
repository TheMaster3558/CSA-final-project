import { toggleFavorite, favorites } from "./favorite.js";


let days = [];
for (let i = 1; i <= 2944; i++) {
    days.push(i);
}


function updatePage() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if ((params.get("page") || "full") == "full") {
        changeToFull();
    }
    else {
        changeToFavorites();
    }
}


export function changeToFull() {
    document.getElementById("gridContainer").innerHTML = "";
    getMoreImages();

    document.addEventListener("DOMContentLoaded", getMoreImages);
    document.addEventListener("scroll", addImagesWhenScrollingDown);
}


export function changeToFavorites() {
    document.getElementById("gridContainer").innerHTML = "";
    addImages(Array.from(favorites));

    document.removeEventListener("DOMContentLoaded", getMoreImages);
    document.removeEventListener("scroll", addImagesWhenScrollingDown);
}


function randomDays(amount) {
    if (days.length === 0 || amount <= 0) {
        return [];
    }

    let randoms = [];
    for (let i = 0; i < amount; i++) {
        if (days.length === 0) {
            break;
        }

        const index = Math.floor(Math.random() * days.length);
        const removed = days.splice(index, 1);
        
        if (removed.length > 0) {
            randoms.push(removed[0]);
        }
    }
    return randoms;
}



function addImages(urls) {
    const gridContainer = document.getElementById("gridContainer");
    const grid = document.createElement("div");
    grid.classList.add("photo-grid")

    for (const url of urls) {
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`api didnt work with status ${response.status}`)
            }
            return response.json()
        })
        .then(data => {
            const img = document.createElement("img");
            img.src = data["img"];
            img.alt = data["alt"];
            img.addEventListener("dblclick", () => toggleFavorite(img, url))
            if (favorites.has(url)) {
                img.style.border = "5px solid pink";
            }

            grid.appendChild(img);

            if (grid.children.length == urls.length) {
                for (const child of grid.children) {
                    gridContainer.appendChild(grid);
                }
            }
        })
    }
}


function getMoreImages() {
    const urls = [];
    for (const day of randomDays(12)) {
        urls.push(`https://xkcd.now.sh/?comic=${day}`);
    }
    addImages(urls);
}


function addImagesWhenScrollingDown() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight) {
        getMoreImages();
    }
}

updatePage();
