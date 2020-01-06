import {mapManager, gameManager} from '../index.js';
import {Explosion} from "../entities.js";

export default class PhysicsManager {
    static update_pos(entity) {
        if (!(entity instanceof Explosion)) {
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

            if (!this.isObstacleAtXY(entity, newX, newY)) {
                entity.posX = newX;
                entity.posY = newY;
            }
        }
    }

    static isObstacleAtXY(entity, x, y) {
        if (mapManager.getTilesetIdx(x, y) === 0 &&
            x < mapManager.mapSize.x - entity.sizeX &&
            y < mapManager.mapSize.y - entity.sizeY &&
            x > 0 &&
            y > 0 &&
            !this.entityAtXY(entity, x, y)) {
            return false;
        }
        return true
    }

    static entityAtXY(entity, x, y) {
        // поиск объекта по координатам
        for (let i = 0; i < gameManager.entities.length; i++) {
            const e = gameManager.entities[i];
            if (e.name !== entity.name) {
                if (
                    x + entity.sizeX - 1 < e.posX || // не пересекаются
                    y + entity.sizeY - 1 < e.posY ||
                    x > e.posX + e.sizeX - 1 ||
                    y > e.posY + e.sizeY - 1
                )
                    continue;
                return e;
            }
        }
        return null;
    }
}