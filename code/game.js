import GameManager from './managers/gameManager.js';
import MapManager from './managers/mapManager.js';
import SpriteManager from './managers/spriteManager.js';
import EventsManager from './managers/eventsManager.js';
import ViewManager from "./managers/viewManager.js";
import {Tank, BotTank, Fireball, Explosion} from './entities.js';

export let mapManager = new MapManager();
export let gameManager = new GameManager();
export let spriteManager = new SpriteManager();
export let eventsManager = new EventsManager();
export let viewManager = new ViewManager(768, 768);

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

loadAll();
canvas.width = mapManager.mapSize.x;
canvas.height = mapManager.mapSize.y;

gameManager.play(ctx);

function loadAll() {
    loadMap('../../resources/map.json');
    loadAtlas('../../resources/atlas.json', '../../resources/spritesheet.png');
    createGameFactory();

    mapManager.parseEntities(); // разбор сущностей карты
    mapManager.draw(ctx); // отобразить карту

    eventsManager.setup(canvas);
}

function createGameFactory() {
    gameManager.factory['tank'] = () =>
        new Tank({
            name: 'playerTank',
            posX: 32,
            posY: 32,
            sizeX: 32,
            sizeY: 32,
            moveX: 0,
            moveY: 0,
            speed: 64,
            spriteBaseName: 'tank_sand',
            direction: 'down'
        });

    gameManager.factory['blueTank'] = () =>
        new BotTank({
            name: 'blueTank1',
            posX: 32,
            posY: 32,
            sizeX: 32,
            sizeY: 32,
            moveX: 0,
            moveY: 0,
            speed: 64,
            spriteBaseName: 'tank_blue',
            direction: 'down'
        });

    gameManager.factory['fireball'] = () =>
        new Fireball({
            name: 'fireball',
            posX: 32,
            posY: 32,
            sizeX: 32,
            sizeY: 32,
            moveX: 0,
            moveY: 0,
            speed: 64,
            spriteBaseName: 'fireball',
            direction: 'down'
        });

    gameManager.factory['explosion'] = () =>
        new Explosion({
            name: 'explosion1',
            posX: 32,
            posY: 32,
            sizeX: 32,
            sizeY: 32,
            spriteBaseName: 'explosion',
            stageChangeSpeed: 50
        });
}
function loadMap(path) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            mapManager.parseMap(JSON.parse(request.responseText));
        }
    };
    request.open("GET", path, true);
    request.send();
}

function loadAtlas(atlasJson, atlasImg) {
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