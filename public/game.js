import GameManager from './managers/gameManager.js';
import MapManager from './managers/mapManager.js';
import SpriteManager from './managers/spriteManager.js';
import EventsManager from './managers/eventsManager.js';
import ViewManager from "./managers/viewManager.js";
import SoundManager from "./managers/soundManager.js";
import RecordManager from "./managers/recordManager.js";
import {Tank, BotTank, Fireball, Explosion} from './entities.js';
import {loadAtlas, loadViewBackgrounds, loadMap} from  "./loaders.js";
import {sounds, viewBackgrounds, atlasImg, atlasJson} from './source.js';

export let mapManager = new MapManager();
export let gameManager = new GameManager(1);
export let spriteManager = new SpriteManager();
export let eventsManager = new EventsManager();
export let viewManager = new ViewManager(768, 768);
export let soundManager = new SoundManager();
export let recordManager = new RecordManager();

const canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

soundManager.init();
soundManager.loadSounds(sounds);
loadAtlas(atlasJson, atlasImg);
loadViewBackgrounds(viewBackgrounds);
createGameFactory();
eventsManager.setup(canvas);

loadLevel();

function loadLevel() {
    recordManager.startFixLevelRecord();
    loadMap(`../../resources/descriptions/mapLevel${gameManager.level}.json`);
    mapManager.parseEntities(); // разбор сущностей карты
    canvas.width = mapManager.mapSize.x;
    canvas.height = mapManager.mapSize.y;
    gameManager.play(ctx);
}

export default function nextLevel(action) {
    recordManager.incLevelsSumDuration();
    recordManager.startFixLevelRecord();
    gameManager.clearManager();
    ctx.clearRect(0, 0, mapManager.mapSize.x, mapManager.mapSize.y);

    if (action === 'next_level') {
        gameManager.level += 1;
    }
    if (gameManager.level <= 2) {
        loadLevel();
    } else {
        viewManager.renderGameCompletion(ctx);
        soundManager.init();
        soundManager.play('../../resources/sounds/game_win.mp3', {looping:true, volume: 1});
    }
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