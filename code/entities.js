class Entity {
    constructor(pos_x, pos_y, size_x, size_y) {
        // позиция
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        // размеры
        this.size_x = size_x;
        this.size_y = size_y;
    }
}

export default class PlayerTank extends Entity {
    constructor({pos_x, pos_y, size_x, size_y, move_x, move_y, speed}) {
        super(pos_x, pos_y, size_x, size_y);
        this.name = 'playerTank';
        this.move_x = move_x;
        this.move_y = move_y;
        this.speed = speed;
    }

    update_pos() {

    }
}