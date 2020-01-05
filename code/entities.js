import {spriteManager, gameManager, mapManager} from './index.js';

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
    constructor({name, posX, posY, sizeX, sizeY, moveX, moveY, speed, direction, spriteBaseName}) {
        super(new Tank({name, posX, posY, sizeX, sizeY, moveX, moveY, speed, direction, spriteBaseName}));
        this.actions = [];
        this.spotPlayer = false;
    }

    static directions = ['up', 'down', 'left', 'right'];

    think() {

        this.moveX = 0;
        this.moveY = 0;

        let action = BotTank.directions[Math.floor(Math.random() * BotTank.directions.length)];

        if (action && !this.spotPlayer) {
            this.actions[action] = true;
        }

        let player = gameManager.player;

        if (Math.abs(player.posY - this.posY) < 10) {
            if (player.posX < this.posX && this.actions['left']) {
                this.moveX = -1;
            }
            if (player.posX > this.posX && this.actions['right']) {
                this.moveX = 1;
            }
            this.spotPlayer = true;
            return;
        }

        if (Math.abs(player.posX - this.posX) < 10) {
            if (player.posY < this.posY && this.actions['up']) {
                this.moveY = -1;
            }
            if (player.posY > this.posY && this.actions['down']) {
                this.moveY = 1;
            }
            this.spotPlayer = true;
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
}