import {eventsManager, gameManager, mapManager} from '../game.js';
import PhysicsManager from './physicsManager.js';
import {BotTank, Fireball, Explosion} from '../entities.js';

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
        setInterval(() => gameManager.updateEnemyTanksDecision(), 1000);
        setInterval(() => gameManager.updateEnemyTanksPhysics(), 50);
        setInterval(() => gameManager.updateExplosions(), 50);
        setInterval(() => gameManager.updateFireballs(), 100);
        setInterval(() => gameManager.updateView(ctx), 50);
        setInterval(() => gameManager.updateLaterKill(), 50);
    }

    updateLaterKill() {
        // удаление накопившихся объектов для удаления
        for (let i = 0; i < this.laterKill.length; i++) {
            const idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1) {
                this.entities.splice(idx, 1);
            }
        }

        // очистка массива
        if (this.laterKill.length) this.laterKill.length = 0;
    }

    updateEnemyTanksDecision() {
        this.entities.forEach(entity => {
            if (entity instanceof BotTank) {
                entity.think();

                if (entity.actions['shoot']) {
                    this.createFireball(entity);
                }
            }
        })
    }

    updateEnemyTanksPhysics() {
        this.entities.forEach(entity => {
            if (entity instanceof BotTank) {
                PhysicsManager.update_pos(entity);
                let another_entity = PhysicsManager.entityAtXY(entity, entity.posX, entity.posY);

                if (another_entity) {
                    if (another_entity instanceof Explosion) {
                        this.laterKill.push(entity);
                    }
                }
            }
        })
    }

    updateExplosions() {
        this.entities.forEach(entity => {
            if (entity instanceof Explosion) {
                entity.stage += 1;

                if (entity.stage === 3) {
                    this.laterKill.push(entity);
                }
            }
        })
    }

    updateFireballs() {
        this.entities.forEach(entity => {
            if (entity instanceof Fireball) {
                PhysicsManager.update_pos(entity);

                let newX = entity.posX + Math.floor(entity.moveX * entity.speed);
                let newY = entity.posY + Math.floor(entity.moveY * entity.speed);

                if (PhysicsManager.isObstacleAtXY(entity, newX, newY)) {
                    let explosion = Object.create(this.factory['explosion']());
                    explosion.posX = newX;
                    explosion.posY = newY;
                    this.entities.push(explosion);
                    this.laterKill.push(entity);
                }
            }
        })
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

        if (eventsManager.actions['shoot']) {
            this.createFireball(this.player);
        }

        PhysicsManager.update_pos(this.player);

        let another_entity = PhysicsManager.entityAtXY(this.player, this.player.posX, this.player.posY);

        if (another_entity) {
            if (another_entity instanceof Explosion) {
                this.laterKill.push(this.player);
            }
        }

        eventsManager.actions = eventsManager.actions.map(action => false);
    }


    createFireball(entity) {
        let fireball = Object.create(this.factory['fireball']());
        fireball.direction = entity.direction;
        fireball.moveX = (fireball.direction === 'left') ? -1 : (fireball.direction === 'right') ? 1 : 0;
        fireball.moveY = (fireball.direction === 'up') ? -1 : (fireball.direction === 'down') ? 1 : 0;

        fireball.posX = entity.posX;
        fireball.posY = entity.posY;

        this.entities.push(fireball);
    }
}
