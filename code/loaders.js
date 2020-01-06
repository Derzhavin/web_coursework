import {mapManager, spriteManager} from "./game.js";

export function loadMap(path) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            mapManager.parseMap(JSON.parse(request.responseText));
        }
    };
    request.open("GET", path, true);
    request.send();
}

export function loadAtlas(atlasJson, atlasImg) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            spriteManager.parseAtlas(JSON.parse(request.responseText));
        }
    };
    request.open("GET", atlasJson, true);
    request.send();
    spriteManager.loadImage(atlasImg);
}