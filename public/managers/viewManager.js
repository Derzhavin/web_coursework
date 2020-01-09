import {recordManager, gameManager} from "../game.js";

export default class ViewManager {
    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.gameStatusFont = '100px sans-serif';
        this.gameHelpFont = '30px sans-serif';
        this.gameLevelInfoFont = '30px sans-serif';
        this.backgrounds = {};
        this.imgsLoaded = false;
    }

    renderLevelCompletion(ctx, text) {
        this.renderTranslucentCtx(ctx);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = this.gameStatusFont;
        ctx.fillText(text, this.sizeX / 2, this.sizeY / 2);

        let newText = "";
        if (text === 'WIN') {
            newText = 'Press N to go to continue';
        } else if (text === 'GAME OVER') {
            newText = 'Press R to restart the game';
        }

        ctx.font = this.gameHelpFont;
        ctx.fillText(newText, this.sizeX / 2, this.sizeY / 3 * 2);
    }

    renderLevelPause(ctx) {
        this.renderTranslucentCtx(ctx);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = this.gameStatusFont;
        ctx.fillText('PAUSE', this.sizeX / 2, this.sizeY / 2);
        ctx.font = this.gameHelpFont;
        ctx.fillText('Press Enter to resume', this.sizeX / 2, this.sizeY / 3 * 2);
    }
    renderTranslucentCtx(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.50)';
        ctx.fillRect(0, 0, this.sizeX, this.sizeY);
    }

    renderGameCompletion(ctx) {
        if (!this.imgsLoaded) {
            setTimeout(() => this.renderGameCompletion(ctx), 100);
        } else {
            ctx.clearRect(0, 0, this.sizeX, this.sizeY);
            let background = this.backgrounds['../../resources/imgs/crown.png'];
            ctx.drawImage(background, this.sizeX / 2 - background.width / 2,this.sizeY / 2 - background.height /2);
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = this.gameHelpFont;
            ctx.fillText('Congratulations! You finished the game!', this.sizeX / 2, this.sizeY / 6 * 5);
        }
    }

    renderLevelInfo(ctx) {
        let text = `level ${gameManager.level} / time ` + recordManager.getFormatLevelDuration();
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.font = this.gameLevelInfoFont;
        ctx.textAlign = 'left';
        ctx.fillText(text, 5, 30);
    }
}