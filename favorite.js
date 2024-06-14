function readCookie() {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    const favoritesCookie = cookies.find(cookie => cookie.trim().startsWith('favorites='));
    if (favoritesCookie) {
        const favoritesString = favoritesCookie.split('=')[1];
        const favoritesArray = favoritesString.split(',').map(item => decodeURIComponent(item.trim()));
        const favoritesSet = new Set(favoritesArray);
        favoritesSet.delete("");
        return favoritesSet;
    } else {
        return new Set();
    }
}

export const favorites = readCookie();


export function toggleFavorite(element, url) {
    if (!favorites.has(url)) {
        element.style.border = "5px solid pink";
        favorites.add(url);
    }
    else {
        element.style.border = "none";
        favorites.delete(url);

        const params = new URLSearchParams((new URL(window.location.href)).search);
        if ((params.get("page") || "full") == "favorites") {
            window.location.reload();
        }
    }
    
    writeCookie();
}

function writeCookie() {
    document.cookie = `favorites=${Array.from(favorites).map(url => encodeURIComponent(url)).join(",")}`
}
