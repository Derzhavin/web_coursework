import {spriteManager, gameManager} from './index.js';

class Entity {
    constructor(posX, posY, sizeX, sizeY) {
        // позиция
        this.posX = posX;
        this.posY = posY;
        // размеры
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }
}

export default class PlayerTank extends Entity {
    constructor({posX, posY, sizeX, sizeY, moveX, moveY, speed, direction}) {
        super(posX, posY, sizeX, sizeY);
        this.name = 'playerTank';
        this.moveX = moveX;
        this.moveY = moveY;
        this.speed = speed;
        this.direction = direction;
    }

    draw(ctx) {
        spriteManager.drawSprite(
            ctx,
            `tank_sand_${this.direction}`,
            this.posX,
            this.posY
        );
    }
}