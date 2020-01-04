import {mapManager} from '../index.js';
import eventsManager from './eventsManager.js';

export default class PhysicsManager {
    static update_pos(entity) {

        let new_x = entity.pos_x + Math.floor(entity.move_x * entity.speed);
        let new_y = entity.pos_y + Math.floor(entity.move_y * entity.speed);

        if (mapManager.getTilesetIdx(new_x, new_y) === 0 &&
            new_x < mapManager.mapSize.x - entity.size_x &&
            new_y < mapManager.mapSize.y - entity.size_y &&
            new_x > 0 &&
            new_y > 0) {
            entity.pos_x = new_x;
            entity.pos_y = new_y;
        }

    }
}