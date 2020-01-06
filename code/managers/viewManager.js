export default class ViewManager {
    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.gameStatusFont = '100px sans-serif';
        this.gameHelpFont = '30px sans-serif';
    }

    renderLevelCompletion(ctx, level, text) {
        this.renderTranslucentCtx(ctx);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = this.gameStatusFont;
        ctx.fillText(text, this.sizeX / 2, this.sizeY / 2);

        let newText = "";
        if (text === 'WIN' && level !== 2) {
            newText = 'Press Space to go to the next level';
        } else if (text === 'GAME OVER') {
            newText = 'Press Enter to restart level';
        } else  {
            newText = 'Congratulations! You finished the game!'
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
}