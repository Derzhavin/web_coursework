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
        setInterval(() => gameManager.updatePlayer(), 50);
        setInterval(() => gameManager.entities.forEach(entity => {if (entity instanceof BotTank) {entity.think();}}), 1000);
        setInterval(() => gameManager.entities.forEach(entity => {if (entity instanceof BotTank) {PhysicsManager.update_pos(entity);}}), 50);
        setInterval(() => gameManager.updateView(ctx), 50);
    }

    updateView(ctx) {
        mapManager.draw(ctx);
        this.draw(ctx);
    }

    updatePlayer() {
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

        PhysicsManager.update_pos(this.player);

        eventsManager.actions = eventsManager.actions.map(action => false);
    }
}
