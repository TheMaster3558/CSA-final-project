let days = [];
for (let i = 1; i <= 2944; i++) {
    days.push(i);
}


function randomDays(amount) {
    if (days.length == 0) {
        return [];
    }

    randoms = [];
    for (let i = 0; i < amount; i++) {
        if (days.length == 0) {
            break;
        }

        const index = days[Math.floor(Math.random() * days.length)];
        randoms.push(days.splice(index, 1)[0]);
    }
    return randoms;
}


function addImages(list) {
    const gridContainer = document.getElementById("gridContainer");
    const grid = document.createElement("div");
    grid.classList.add("photo-grid")

    for (const i of list) {
        fetch(`https://xkcd.com/${i}/info.0.json`)
        .then(response => {
            if (!response.ok) {
                console.log(response.status);
                throw new Error(`api didnt work with status ${response.status}`)
            }
            return response.json()
        })
        .then(data => {
            const img = document.createElement("img");
            img.src = data["img"];
            img.alt = data["alt"];
            grid.appendChild(img);

            if (grid.children.length == list.length) {
                for (const child of grid.children) {
                    gridContainer.appendChild(grid);
                }
            }
        })
    }
}


function getMoreImages() {
    addImages(randomDays(12));
}


function addImagesWhenScrollingDown() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight) {
        getMoreImages();
    }
}


document.addEventListener("DOMContentLoaded", getMoreImages);
document.addEventListener("scroll", addImagesWhenScrollingDown);
