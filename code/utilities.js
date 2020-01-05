export default function randInt(min, max) {
    return Math.floor(Math.random() * (+max - +min)) + +min;
}