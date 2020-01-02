import GameManager from './managers/GameManager';
import MapManager from 'managers/mapManager';

import map_for_level_1 from '../resources/maps/map_for_level_1.json';

let mapManager = new MapManager();
let gameManager = new GameManager();

const ctx = canvas.getContext('2d');
const canvas = document.querySelector('canvas');

function loadAll() {
    document.getElementById("Score").innerHTML = 'Очки: 0';
    mapManager.loadMap("map_for_level_1.json"); // загрузка карты
    mapManager.parseEntities(); // разбор сущностей карты
    mapManager.draw(ctx); // отобразить карту
}