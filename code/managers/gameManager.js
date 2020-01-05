import {eventsManager, gameManager, mapManager} from '../index.js';
import PhysicsManager from './physicsManager.js';
import {BotTank} from '../entities.js';

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
        setInterval(() => this.entities.forEach(entity => {if (entity instanceof BotTank) {entity.think()}}), 2000)
    }

    update(ctx) {
        if (!this.player) {
            return;
        }
        this.player.moveX = 0;
        this.player.moveY = 0;

        if (eventsManager.actions['up']) {
            this.player.moveY = -1;
        }
        if (eventsManager.actions['down']) {
            this.player.moveY = 1;
        }
        if (eventsManager.actions['left']) {
            this.player.moveX = -1;
        }
        if (eventsManager.actions['right']) {
            this.player.moveX = 1;
        }

        this.entities.forEach(entity => PhysicsManager.update_pos(entity));

        mapManager.draw(ctx);
        this.draw(ctx);
        eventsManager.actions = eventsManager.actions.map(action => false);
    }
}
