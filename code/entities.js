import {spriteManager, gameManager, mapManager} from './index.js';
import PhysicsManager from "./managers/physicsManager.js";

class Entity {
    constructor({name, posX, posY, sizeX, sizeY, spriteBaseName}) {
        // позиция
        this.posX = posX;
        this.posY = posY;
        // размеры
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.name = name;
        this.spriteBaseName = spriteBaseName;
    }
}

class MovableEntity extends Entity {
    constructor({name, posX, posY, sizeX, sizeY, moveX, moveY, speed, spriteBaseName, direction}) {
        super(new Entity({name, posX, posY, sizeX, sizeY, spriteBaseName}));
        this.moveX = moveX;
        this.moveY = moveY;
        this.speed = speed;
        this.direction = direction;
    }

}

export class Tank extends MovableEntity {
    draw(ctx) {
        spriteManager.drawSprite(
            ctx,
            `${this.spriteBaseName}_${this.direction}`,
            this.posX,
            this.posY
        );
    }
}

export class BotTank extends Tank {
    constructor({name, posX, posY, sizeX, sizeY, moveX, moveY, speed, spriteBaseName, direction}) {
        super(new Tank({name, posX, posY, sizeX, sizeY, moveX, moveY, speed, spriteBaseName, direction}));
        this.actions = [];
        this.spotPlayer = false;
    }

    static decisions = ['up', 'down', 'left', 'right', 'shoot'];

    think() {
        this.moveX = 0;
        this.moveY = 0;

        let action = BotTank.decisions[Math.floor(Math.random() * BotTank.decisions.length)];

        if (action && !this.spotPlayer) {
            this.actions[action] = true;
        }

        let player = gameManager.player;

        if (Math.abs(player.posY - this.posY) < 10) {
            if (player.posX < this.posX && this.actions['left']) {
                this.moveX = -1;
                this.react();
            }
            if (player.posX > this.posX && this.actions['right']) {
                this.moveX = 1;
                this.react();
            }
            return;
        }

        if (Math.abs(player.posX - this.posX) < 10) {
            if (player.posY < this.posY && this.actions['up']) {
                this.moveY = -1;
                this.react();
            }
            if (player.posY > this.posY && this.actions['down']) {
                this.moveY = 1;
                this.react();
            }
            return
        }

        this.spotPlayer = false;

        if (this.actions['up']) {
            this.moveY = -1;
        }
        if (this.actions['down']) {
            this.moveY = 1;
        }
        if (this.actions['left']) {
            this.moveX = -1;
        }
        if (this.actions['right']) {
            this.moveX = 1;
        }

        this.actions = this.actions.map(action => false);
    }

    react() {
        this.actions['shoot'] = true;
        this.spotPlayer = true;
    }
}

export class Fireball extends MovableEntity {
    draw(ctx) {
        spriteManager.drawSprite(
            ctx,
            this.spriteBaseName,
            this.posX,
            this.posY
        );
    }
}

export class Explosion extends Entity {
    constructor({name, posX, posY, sizeX, sizeY, spriteBaseName, stageChangeSpeed}) {
        super(new Entity({name, posX, posY, sizeX, sizeY, spriteBaseName}));
        this.stage = 1;
        this.stageChangeSpeed = stageChangeSpeed;
    }

    draw(ctx) {
        spriteManager.drawSprite(
            ctx,
            `${this.spriteBaseName}${this.stage}`,
            this.posX,
            this.posY
        );
    }
}