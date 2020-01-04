import {eventsManager} from "../index.js";

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
            this.entities[e].draw(ctx, this.player);
    }

    play() {

    }

    update() {
        this.player.move_x = 0;
        this.player.move_y = 0;

        if (eventsManager.action['up']) {
            this.player.move_y = -1;
        }
        if (eventsManager.action['down']) {
            this.player.move_y = 1;
        }
        if (eventsManager.action['left']) {
            this.player.move_x = -1;
        }
        if (eventsManager.action['right']) {
            this.player.move_x = 1;
        }

        this.entities.forEach(entity => {
            try {
                entity.update();
            } catch (exception) {}
        });
    }
}
