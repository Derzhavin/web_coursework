export default class SoundManager {
    constructor() {
        this.clips = {}; // звуковые эффекты
        this.context = null; // аудиоконтекст
        this.gainNode = null; // главный узел
        this.loaded = false;
        this.lastMusic = null;
    }

    init() {
        this.context = new AudioContext();
        this.gainNode = this.context.createGain
            ? this.context.createGain()
            : this.context.createGainNode();
        this.gainNode.connect(this.context.destination);
    }

    load(path, callback) {
        if (this.clips[path]) {
            callback(this.clips[path]);
            return;
        }
        const clip = {
            path,
            buffer: null,
            loaded: false,
        };
        clip.play = (volume, loop) => {
            this.play(this.path, {
                looping: loop ? loop : false,
                volume: volume ? volume : 1,
            });
        };
        this.clips[path] = clip;
        const request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            this.context.decodeAudioData(request.response, buffer => {
                clip.buffer = buffer;
                clip.loaded = true;
                callback(clip);
            });
        };
        request.send();
    }


    loadSounds(array) {
        for (let i = 0; i < array.length; i++) {
            this.load(array[i], () => {
                if (array.length === Object.keys(this.clips).length) {
                    for (let sd in this.clips) if (!this.clips[sd].loaded) return;
                    this.loaded = true;
                }
            });
        }
    }


    play(path, settings) {
        if (!this.loaded) {
            setTimeout(() => this.play(path, settings), 1000);
            return;
        }
        let looping = false;
        let volume = 1;
        if (settings) {
            if (settings.looping) looping = settings.looping;
            if (settings.volume) volume = settings.volume;
        }
        const sd = this.clips[path];
        this.lastMusic = path;
        if (sd === null) return false;
        const sound = this.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(this.gainNode);
        sound.loop = looping;
        this.gainNode.gain.value = volume;
        sound.start(0);
        return true;
    }

    //Заканчивает всю музыку
    stopAll() {
        this.gainNode.disconnect();
    }

    resumePlay() {
        this.gainNode.connect(this.context.destination);
    }
    playLevelFinalMusic(isWin) {
        this.init();
        this.play(`../../resources/sounds/${isWin ? 'level_win' : 'game_over'}.mp3`, {
            volume: 0.1,
            looping: false
        });
    }

    playPauseOutMusic() {
        this.init();
        this.play('../../resources/sounds/pause_out.mp3', {volume: 0.1, looping: false});
        this.play('../../resources/sounds/background.mp3', {looping: true, volume: 0.1});
    }
    playPauseInMusic() {
        this.stopAll();
        this.init();
        this.play('../../resources/sounds/pause_in.mp3', {volume: 0.1, looping: false});
    }

    playGameFinalMusic() {
        if (this.lastMusic !== '../../resources/sounds/game_win.mp3') {
            this.resumePlay();
            this.play('../../resources/sounds/game_win.mp3', {volume: 0.1, looping: false});
        }

    }
    playBackgroundMusic() {
        this.play('../../resources/sounds/background.mp3', {looping: true, volume: 0.1});
    }
}
