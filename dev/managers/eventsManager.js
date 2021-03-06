export default class EventsManager {
    constructor() {
        this.bind = []; // сопоставление клавиш действиям
        this.actions = []; // действия
    }

    setup(canvas) {
        this.bind[87] = 'up'; // w
        this.bind[65] = 'left'; // a
        this.bind[83] = 'down'; // s
        this.bind[68] = 'right'; // d
        this.bind[90] = 'shoot'; // z
        this.bind[13] = 'pause' // enter
        this.bind[78] = 'next_level' // n
        this.bind[82] = 'restart' // r
        document.body.addEventListener('keydown', e => this.onKeyDown(e));
    }

    onKeyDown(event) {
        const action = this.bind[event.keyCode];
        if (action) this.actions[action] = true;
    }
}
