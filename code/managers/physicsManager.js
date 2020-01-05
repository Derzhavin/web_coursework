import {mapManager} from '../index.js';
import eventsManager from './eventsManager.js';

export default class PhysicsManager {
    static update_pos(entity) {
        if (entity.moveX === -1 && entity.direction !== 'left') {
            entity.direction = 'left';
            return
        }
        if (entity.moveX === 1 && entity.direction !== 'right') {
            entity.direction = 'right';
            return
        }
        if (entity.moveY === -1 && entity.direction !== 'up') {
            entity.direction = 'up';
            return
        }
        if (entity.moveY === 1 && entity.direction !== 'down') {
            entity.direction = 'down';
            return
        }

        let newX = entity.posX + Math.floor(entity.moveX * entity.speed);
        let newY = entity.posY + Math.floor(entity.moveY * entity.speed);

        if (mapManager.getTilesetIdx(newX, newY) === 0 &&
            newX < mapManager.mapSize.x - entity.sizeX &&
            newY < mapManager.mapSize.y - entity.sizeY &&
            newX > 0 &&
            newY > 0) {
            entity.posX = newX;
            entity.posY = newY;
        }

    }
}