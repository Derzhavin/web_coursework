export default class ViewManager {
    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }

    renderLevelCompletion(ctx, text) {
        this.renderLevelPause(ctx, text);
    }

    renderLevelPause(ctx, text) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.50)';
        ctx.fillRect(0, 0, this.sizeX, this.sizeY);

        ctx.font = '100px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, this.sizeX / 2, this.sizeY / 2);
    }
}