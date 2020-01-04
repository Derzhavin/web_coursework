export default class PhysicsManager {
    static update(obj) {
        obj.pos_x += Math.floor(obj.move_x * obj.speed);
        obj.pos_y += Math.floor(obj.move_y * obj.speed);
    }
}