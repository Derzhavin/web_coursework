import {eventsManager, mapManager, viewManager, soundManager} from '../game.js';
import PhysicsManager from './physicsManager.js';
import {BotTank, Fireball, Explosion} from '../entities.js';
import {loadMap} from "../loaders.js";
import {updateRecordInLC} from "./recordManager.js"

export default class GameManager {
    constructor(level, maxLevel, ctx) {
        this.factory = {}; // фабрика объектов на карте
        this.entities = []; // объекты на карте (не убитые)
        this.player = null;
        this.laterKill = [];
        this.isWin = false;
        this.isPlaying = false;
        this.isPause = false;
        this.level = level;
        this.isOneTimeActionsAtTheEndComplete = false;
        this.ctx = ctx;
        this.final = false;
        this.maxLevel = maxLevel;
        this.lastTimeUpdated = Date.now();
        this.lastTimeUpdates = {
            'player': 0,
            'tanks decision': 0,
            'tank physics': 0,
            'fireballs': 0,
            'explosions': 0,
            'later kill': 0,
            'view': 0
        };
        this.summaryTime = 0;
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

    initLevel() {
        loadMap(`../../resources/descriptions/mapLevel${this.level}.json`);
        mapManager.parseEntities();
        soundManager.init()
    }

    play() {
        this.levelTime = 0;
        this.isPlaying = true;
        this.isPause = false;
        this.isOneTimeActionsAtTheEndComplete = false;

        this.initLevel();
        soundManager.playBackgroundMusic()
        this.updateAll(this.ctx);
    }

    nextLevel(action) {
        soundManager.stopAll();
        soundManager.lastMusic = null;

        let isWinCopy = this.isWin;

        this.entities = [];
        this.laterKill = [];
        this.isWin = false;
        this.isPlaying = false;
        this.isPause = false;

        if (action === 'restart' && !this.isWin) {
            soundManager.stopAll();
            this.level = 1;
        } else if (action === 'next_level') {
            if (isWinCopy && (this.level == this.maxLevel)) {
                this.final = true;
                this.isOneTimeActionsAtTheEndComplete = true;
                return;
            } else {
                this.level += 1;
            }
        }

        this.play()
    }

    isBotTanksExist() {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i] instanceof BotTank) {
                return true;
            }
        }
        return false;
    }

    updateAll(ctx) {
        let currentTime = Date.now();
        let deltaTime = currentTime - this.lastTimeUpdated;

        if (this.final) {
            viewManager.renderGameCompletion(ctx);
            soundManager.playGameFinalMusic();
            if (this.final && eventsManager.actions['restart']) {
                updateRecordInLC(this.levelTime);
                this.final = false;
                this.summaryTime = 0;
                this.nextLevel('restart');
            }
        } else {
            if (!this.isPause) {
                this.levelTime += deltaTime;
            }

            if (this.player) {
                if (currentTime - this.lastTimeUpdates['player'] > 29) {
                    this.lastTimeUpdates['player'] = currentTime;
                    this.updatePlayer();
                }
                if (!this.isPause) {
                    if (currentTime - this.lastTimeUpdates['tanks decision'] > 999) {
                        this.lastTimeUpdates['tanks decision'] = currentTime;
                        this.updateEnemyTanksDecision();
                    }
                    if (currentTime - this.lastTimeUpdates['tank physics'] > 29) {
                        this.lastTimeUpdates['tank physics'] = currentTime;
                        this.updateEnemyTanksPhysics();
                    }
                    if (currentTime - this.lastTimeUpdates['fireballs'] > 49) {
                        this.lastTimeUpdates['fireballs'] = currentTime;
                        this.updateFireballs()
                    }
                    if (currentTime - this.lastTimeUpdates['explosions'] > 99) {
                        this.lastTimeUpdates['explosions'] = currentTime;
                        this.updateExplosions();
                    }
                }

                if (currentTime - this.lastTimeUpdates['later kill'] > 29) {
                    this.lastTimeUpdates['later kill'] = currentTime;
                    this.updateLaterKill();
                }

                if (!this.isBotTanksExist()) {
                    this.isPlaying = false;
                    this.isPause = true;
                    this.isWin = true;
                }

                if (!this.isPlaying && !this.isOneTimeActionsAtTheEndComplete) {
                    soundManager.stopAll();
                    soundManager.playLevelFinalMusic(this.isWin);
                    this.isOneTimeActionsAtTheEndComplete = true;
                }
            }

            if (currentTime - this.lastTimeUpdates['view'] > 29) {
                this.lastTimeUpdates['view'] = currentTime;
                this.updateView(ctx);
            }

        }
        this.lastTimeUpdated = Date.now();
        requestAnimationFrame(() => this.updateAll(ctx));
    }

    updateLaterKill() {
        for (let i = 0; i < this.laterKill.length; i++) {
            const idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1) {
                this.entities.splice(idx, 1);
            }
        }
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
        });
    }

    updateEnemyTanksPhysics() {
        this.entities.forEach(entity => {
            if (entity instanceof BotTank) {
                PhysicsManager.update_pos(entity);
                let another_entity = PhysicsManager.entityAtXY(entity, entity.posX, entity.posY);

                if (another_entity) {
                    if (another_entity instanceof Explosion) {
                        this.kill(entity);
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
                    this.kill(entity);
                }
            }
        });
    }

    updateFireballs() {
        this.entities.forEach(entity => {
            if (entity instanceof Fireball) {
                PhysicsManager.update_pos(entity);

                let newX = entity.posX + Math.floor(entity.moveX * entity.speed);
                let newY = entity.posY + Math.floor(entity.moveY * entity.speed);

                if (PhysicsManager.isObstacleAtXY(entity, newX, newY)) {
                    soundManager.play('../../resources/sounds/explosion.mp3', {volume: 0.1, looping: false});
                    let explosion = Object.create(this.factory['explosion']());
                    explosion.posX = newX;
                    explosion.posY = newY;
                    this.entities.push(explosion);
                    this.kill(entity);
                }
            }
        })
    }

    updateView(ctx) {
        mapManager.draw(ctx);
        this.draw(ctx);
        viewManager.renderLevelInfo(ctx);

        if (!this.isPlaying && this.isPause) {
            viewManager.renderLevelCompletion(ctx, (this.isWin) ? 'WIN' : 'GAME OVER');
            return
        }
        if (this.isPause) {
            viewManager.renderLevelPause(ctx);
        }
    }

    updatePlayer() {
        if (!this.player) {
            return
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
                soundManager.playPauseOutMusic();
            } else {
                this.isPause = true;
                soundManager.playPauseInMusic()
            }
        }

        if (eventsManager.actions['next_level'] && this.isWin) {
            this.summaryTime += this.levelTime;
            this.nextLevel('next_level');
        }
        if (eventsManager.actions['restart'] && !this.isWin) {
            this.summaryTime = 0;
            this.nextLevel('restart');
        }

        PhysicsManager.update_pos(this.player);

        let another_entity = PhysicsManager.entityAtXY(this.player, this.player.posX, this.player.posY);

        if (another_entity) {
            if (another_entity instanceof Explosion) {
                this.kill(this.player);
                this.isPlaying = false;
                this.isWin = false;
                this.isPause = true;
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
