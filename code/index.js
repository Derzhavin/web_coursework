#!/usr/bin/env node

import GameManager from './managers/gameManager.js';
import MapManager from './managers/mapManager.js';
import map from './maps/map.js';

let mapManager = new MapManager();
let gameManager = new GameManager();

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function loadAll() {
    mapManager.parseMap(map); // загрузка карты
    mapManager.parseEntities(); // разбор сущностей карты
    mapManager.draw(ctx); // отобразить карту
}

loadAll();

canvas.width = mapManager.mapSize.x;
canvas.height = mapManager.mapSize.y;
