export function getFormatDuration(duration) {
    let time = duration / 1000;
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time - hours * 60 * 60) / 60);
    let seconds = Math.floor(time - hours * 60 * 60 - minutes * 60);
    let format = (number) => {
        return (number / 10 >= 1) ? number : '0' + number
    };
    return format(hours) + ':' + format(minutes) + ':' + format(seconds);
}


export function updateRecordInLC(levelTime) {
    let oldRecord = localStorage['RIP_tanks.record.' + localStorage['RIP_tanks.username']];

    if (oldRecord === undefined) {
        localStorage['RIP_tanks.record.' + localStorage['RIP_tanks.username']] = getFormatDuration(levelTime);
        return;
    }
    let lastRecordInSeconds = strRecordToSeconds(oldRecord);

    if (levelTime < lastRecordInSeconds) {
        localStorage['RIP_tanks.record.' + localStorage['RIP_tanks.username']] = getFormatDuration(levelTime);
    }
}

export function strRecordToSeconds(str) {
    let timeDataArr = str.split(':');
    return timeDataArr[0] + timeDataArr[1] * 60 + timeDataArr[2] * 3600;
}

