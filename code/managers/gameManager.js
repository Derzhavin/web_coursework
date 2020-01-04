import {eventsManager, gameManager, mapManager} from '../index.js';
import PhysicsManager from './physicsManager.js';

export default class GameManager {
    constructor() {
        this.factory = {}; // фабрика объектов на карте
        this.entities = []; // объекты на карте (не убитые)
        this.player = null;
        this.laterKill = [];
    }

    initPlayer(obj) {
        this.player = obj;
    }

    kill(obj) {
        this.laterKill.push(obj);
    }

    draw(ctx) {
        for (let e = 0; e < this.entities.length; e++)
            this.entities[e].draw(ctx);
    }

    play(ctx) {
        this.playInterval = setInterval(() => gameManager.update(ctx), 30);
    }

    update(ctx) {
        if (!this.player) {
            return;
        }
        this.player.move_x = 0;
        this.player.move_y = 0;

        if (eventsManager.actions['up']) {
            this.player.move_y = -1;
        }
        if (eventsManager.actions['down']) {
            this.player.move_y = 1;
            console.log('down')
        }
        if (eventsManager.actions['left']) {
            this.player.move_x = -1;
        }
        if (eventsManager.actions['right']) {
            this.player.move_x = 1;
        }

        this.entities.forEach(entity => PhysicsManager.update_pos(entity));

        mapManager.draw(ctx);
        this.draw(ctx);
        console.log(eventsManager.actions);
        eventsManager.actions = eventsManager.actions.map(action => false);
    }
}
