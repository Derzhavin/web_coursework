import {gameManager} from "../game.js";

export default class RecordManager {
    constructor() {
        this.levelsSumDuration = 0;
        this.levelTimeStamp = null;
        this.lastPauseTimeStamp = null;
        this.isPause = false;
        this.savedLevelDuration = 0;
        this.levelDuration = () => {
            if (this.isPause || !gameManager.isPlaying) {
                return this.savedLevelDuration;
            }

            return new Date() - this.levelTimeStamp;
        }
    }

    startFixLevelRecord() {
        this.levelTimeStamp = new Date();
        this.savedLevelDuration = 0;
    }

    pause() {
        this.savedLevelDuration = this.levelDuration();
        this.isPause = true;
        this.lastPauseTimeStamp = new Date();
    }

    resume() {
        let pauseDuration = new Date() - this.lastPauseTimeStamp;
        this.levelTimeStamp.setMilliseconds(this.levelTimeStamp.getMilliseconds() + pauseDuration);
        this.isPause = false;
    }

    getFormatDuration() {
        let time = this.levelDuration() / 1000;
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor((time - hours * 60 * 60) / 60);
        let seconds = Math.floor(time - hours * 60 * 60 - minutes * 60);
        let format = (number) => {return (number / 10 >= 1) ? number: '0' + number};
        return format(hours) +':' + format(minutes) + ':' + format(seconds);
    }

    incLevelsSumDuration() {
        this.levelsSumDuration += this.levelDuration();
    }

    updateRecordInLC() {
        let oldRecord = localStorage['RIP_tanks.records.' + localStorage['RIP_tanks.username']];
	    let lastRecordInSeconds = RecordManager.strRecordToSeconds(oldRecord);
		
        if (this.levelsSumDuration > lastRecordInSeconds) {
            localStorage['RIP_tanks.records.' + localStorage['RIP_tanks.username']] = this.getFormatDuration();
        }
    }

    static strRecordToSeconds(str) {
        let timeDataArr = str.split(':');
        return timeDataArr[0] + timeDataArr[1] * 60 + timeDataArr[2] * 3600;
    }
}
