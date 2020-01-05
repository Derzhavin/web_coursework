import {spriteManager, gameManager, mapManager} from './index.js';
import randInt from './utilities.js'

export class Tank {
    constructor({name, posX, posY, sizeX, sizeY, moveX, moveY, speed, direction, spriteBaseName}) {
        // позиция
        this.posX = posX;
        this.posY = posY;
        // размеры
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.name = name;
        this.moveX = moveX;
        this.moveY = moveY;
        this.speed = speed;
        this.direction = direction;
        this.spriteBaseName = spriteBaseName;
    }

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
    think() {
        this.moveX = randInt(-1, 2);
        this.moveY = randInt(-1, 2);
    }
}