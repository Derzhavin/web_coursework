#!/usr/bin/env node

import GameManager from './managers/gameManager.js';
import MapManager from './managers/mapManager.js';
import SpriteManager from './managers/spriteManager.js';

import map from './maps/map.js';

let mapManager = new MapManager();
let gameManager = new GameManager();
let spriteManager = new SpriteManager();

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function loadAll() {
    mapManager.parseMap(map); // загрузка карты
    mapManager.parseEntities(); // разбор сущностей карты
    mapManager.draw(ctx); // отобразить карту

    spriteManager.loadAtlas();
}

loadAll();

canvas.width = mapManager.mapSize.x;
canvas.height = mapManager.mapSize.y;
