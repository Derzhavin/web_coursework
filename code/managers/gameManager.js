import {eventsManager, mapManager, viewManager, soundManager} from '../game.js';
import PhysicsManager from './physicsManager.js';
import {BotTank, Fireball, Explosion} from '../entities.js';
import {loadMap} from '../loaders.js'

export default class GameManager {
    constructor(level) {
        this.factory = {}; // фабрика объектов на карте
        this.entities = []; // объекты на карте (не убитые)
        this.player = null;
        this.laterKill = [];
        this.isWin = false;
        this.isPlaying = false;
        this.isPause = false;
        this.level = level;
        this.intervalIds = [];
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
        this.isPlaying = true;
        this.isPause = false;
        this.isWin = false;

        this.intervalIds[0] = setInterval(() => this.updateView(ctx), 50);
        this.intervalIds[1] = setInterval(() => this.updateEnemyTanksDecision(), 1000);
        this.intervalIds[2] = setInterval(() => this.updateEnemyTanksPhysics(), 50);
        this.intervalIds[3] = setInterval(() => this.updatePlayer(), 50);
        this.intervalIds[4] = setInterval(() => this.updateExplosions(), 50);
        this.intervalIds[5] = setInterval(() => this.updateFireballs(), 100);
        this.intervalIds[6] = setInterval(() => this.updateLaterKill(), 50);
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
        if (this.player) {
            let botTankExist = false;
            this.entities.forEach(entity => {
                if (entity instanceof BotTank) {
                    botTankExist = true;
                    PhysicsManager.update_pos(entity);
                    let another_entity = PhysicsManager.entityAtXY(entity, entity.posX, entity.posY);

                    if (another_entity) {
                        if (another_entity instanceof Explosion) {
                            this.laterKill.push(entity);
                        }
                    }
                }
            })

            if (!botTankExist) {
                this.isPlaying = false;
                this.isWin = true;
            }
        }
    }

    updateExplosions() {
        if (!this.isPause) {
            this.entities.forEach(entity => {
                if (entity instanceof Explosion) {
                    entity.stage += 1;

                    if (entity.stage === 3) {
                        this.laterKill.push(entity);
                    }
                }
            });
        }
    }

    updateFireballs() {
        this.entities.forEach(entity => {
            if (entity instanceof Fireball) {
                PhysicsManager.update_pos(entity);

                let newX = entity.posX + Math.floor(entity.moveX * entity.speed);
                let newY = entity.posY + Math.floor(entity.moveY * entity.speed);

                if (PhysicsManager.isObstacleAtXY(entity, newX, newY)) {
                    if (!this.isPause) {
                        soundManager.play('../../resources/sounds/explosion.mp3', {volume:0.1, looping:false});
                    }
                    let explosion = Object.create(this.factory['explosion']());
                    explosion.posX = newX;
                    explosion.posY = newY;
                    this.entities.push(explosion);
                    this.laterKill.push(entity);
                }
            }
        })
    }

    updateLevel(ctx) {
        this.entities = [];
        this.laterKill = [];
        this.isWin = false;
        this.level += 1;
        this.intervalIds.forEach(intervalId => clearInterval(intervalId));
        eventsManager.actions = eventsManager.actions.map(action => false);
        loadMap(`../../resources/mapLevel${this.level}.json`);
        mapManager.parseEntities();
    }

    updateView(ctx) {
        mapManager.draw(ctx);
        this.draw(ctx);
        if (!this.isPlaying) {
            viewManager.renderLevelCompletion(ctx, this.level, (this.isWin) ? 'WIN' : 'GAME OVER');
        }
        if (this.isPause) {
            viewManager.renderLevelPause(ctx);
        }
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
        if (eventsManager.actions['pause'] && this.isPlaying) {
            if (this.isPause) {
                this.isPause = false;
                soundManager.init();
                soundManager.play('../../resources/sounds/pause_out.mp3', {volume:0.1, looping:false});
                soundManager.play('../../resources/sounds/background.mp3', {looping: true, volume: 0.1});
            } else  {
                this.isPause = true;
                soundManager.stopAll();
                soundManager.init();
                soundManager.play('../../resources/sounds/pause_in.mp3', {volume:0.1, looping:false});
            }
        }

        PhysicsManager.update_pos(this.player);

        let another_entity = PhysicsManager.entityAtXY(this.player, this.player.posX, this.player.posY);

        if (another_entity) {
            if (another_entity instanceof Explosion) {
                this.laterKill.push(this.player);
                this.isPlaying = false;
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
