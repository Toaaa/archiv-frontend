const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)).toLocaleString() + ' ' + sizes[i];
}

export async function fetchApi(params) {
    const response = await fetch(`${BACKEND_URL}${params}`);
    const resp = await response.json();
    // console.log(resp);
    return resp;
}

export function parseShareTime(params) {
    const urlParams = new URLSearchParams(params);
    if (urlParams.has('t')) {
        return parseInt(urlParams.get('t'));
    }
    return 0;
}

export function toHHMMSS(t, showUnit) {
    const sec_num = parseInt(t, 10);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - hours * 3600) / 60);
    let seconds = sec_num - hours * 3600 - minutes * 60;
    let h = hours < 10 ? '0' + hours : hours;
    let m = minutes < 10 ? '0' + minutes : minutes;
    let s = seconds < 10 ? '0' + seconds : seconds;
    let mmss = m + ':' + s;
    if (hours == 0) {
        return showUnit ? mmss + 'm' : mmss;
    } else {
        return showUnit ? h + ':' + mmss + 'h' : h + ':' + mmss;
    }
}

export function SrtTimecodeToSeconds(timecode) {
    const splitted = timecode.split(':');
    const hours = parseInt(splitted[0]);
    const minutes = parseInt(splitted[1]);
    let seconds;
    let ms;
    if (splitted[2].includes('.')) {
        seconds = parseInt(splitted[2].split('.')[0]);
        ms = parseInt(splitted[2].split('.')[1]);
    } else {
        seconds = parseInt(splitted[2].split(',')[0]);
        ms = parseInt(splitted[2].split(',')[1]);
    }
    const totalSeconds = hours * 60 * 60 + minutes * 60 + seconds + ms / 1000;

    return totalSeconds;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
