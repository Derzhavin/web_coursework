import GameManager from './managers/gameManager.js';
import MapManager from './managers/mapManager.js';
import SpriteManager from './managers/spriteManager.js';
import EventsManager from './managers/eventsManager.js';
import ViewManager from "./managers/viewManager.js";
import SoundManager from "./managers/soundManager.js";
import {Tank, BotTank, Fireball, Explosion} from './entities.js';
import {loadAtlas, loadViewBackgrounds} from  "./loaders.js";
import {sounds, viewBackgrounds, atlasImg, atlasJson} from './constants.js';

const canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

export let mapManager = new MapManager();
export let gameManager = new GameManager(1, 2, ctx);
export let spriteManager = new SpriteManager();
export let eventsManager = new EventsManager();
export let viewManager = new ViewManager(768, 768);
export let soundManager = new SoundManager();

soundManager.init();
soundManager.loadSounds(sounds);
loadAtlas(atlasJson, atlasImg);
loadViewBackgrounds(viewBackgrounds);
createGameFactory();
eventsManager.setup(canvas);
canvas.width = mapManager.mapSize.x;
canvas.height = mapManager.mapSize.y;

gameManager.play();

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
