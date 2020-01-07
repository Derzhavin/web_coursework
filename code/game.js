import GameManager from './managers/gameManager.js';
import MapManager from './managers/mapManager.js';
import SpriteManager from './managers/spriteManager.js';
import EventsManager from './managers/eventsManager.js';
import ViewManager from "./managers/viewManager.js";
import SoundManager from "./managers/soundManager.js";
import {Tank, BotTank, Fireball, Explosion} from './entities.js';
import {loadMap, loadAtlas} from "./loaders.js";

export let mapManager = new MapManager();
export let gameManager = new GameManager(1);
export let spriteManager = new SpriteManager();
export let eventsManager = new EventsManager();
export let viewManager = new ViewManager(768, 768);
export let soundManager = new SoundManager();

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

soundManager.init();
soundManager.loadArray([
        '../../resources/sounds/background.mp3',
        '../../resources/sounds/explosion.mp3',
        '../../resources/sounds/game_over.mp3',
        '../../resources/sounds/pause_in.mp3',
        '../../resources/sounds/pause_out.mp3'
]);
loadMap('../../resources/mapLeveL1.json');
loadAtlas('../../resources/atlas.json', '../../resources/spritesheet.png');
createGameFactory();
mapManager.parseEntities(); // разбор сущностей карты

mapManager.draw(ctx); // отобразить карту
eventsManager.setup(canvas);

canvas.width = mapManager.mapSize.x;
canvas.height = mapManager.mapSize.y;

soundManager.play('../../resources/sounds/background.mp3', {looping: true, volume: 0.1});
gameManager.play(ctx);

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