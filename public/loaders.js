import {mapManager, spriteManager, viewManager} from "./game.js";

export function loadMap(path) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            mapManager.parseMap(JSON.parse(request.responseText));
        }
    };
    request.open("GET", path, false);
    request.send();
}

export function loadAtlas(atlasJson, atlasImg) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            spriteManager.parseAtlas(JSON.parse(request.responseText));
        }
    };
    request.open("GET", atlasJson, true);
    request.send();
    spriteManager.loadImage(atlasImg);
}

export function loadViewBackgrounds(paths) {
    let imgCount = paths.length;
    for(let i = 0; i < paths.length; i++ ) {
        let img = new Image()
        img.onload = () => {
            imgCount--;
            if (imgCount === 0) {
                viewManager.imgsLoaded = true;
            }
        };

        img.src = paths[i];
        viewManager.backgrounds[paths[i]] = img;
    }
}