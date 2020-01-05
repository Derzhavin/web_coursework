#!/usr/bin/env node

import GameManager from './managers/gameManager.js';
import MapManager from './managers/mapManager.js';
import SpriteManager from './managers/spriteManager.js';
import EventsManager from './managers/eventsManager.js';
import {Tank, BotTank} from './entities.js';

import map from './maps/map.js';

export let mapManager = new MapManager();
export let gameManager = new GameManager();
export let spriteManager = new SpriteManager();
export let eventsManager = new EventsManager();

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


loadAll();
canvas.width = mapManager.mapSize.x;
canvas.height = mapManager.mapSize.y;

gameManager.play(ctx);

function loadAll() {
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
            direction: 'down',
            spriteBaseName: 'tank_sand',
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
            direction: 'down',
            spriteBaseName: 'tank_blue'
        });

    mapManager.parseMap(map); // загрузка карты
    mapManager.parseEntities(); // разбор сущностей карты
    mapManager.draw(ctx); // отобразить карту

    spriteManager.loadAtlas();

    eventsManager.setup(canvas);
}