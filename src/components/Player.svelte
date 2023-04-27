<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import videojs from 'video.js';
    import 'video.js/dist/video-js.css';
    import 'videojs-seek-buttons';
    import 'videojs-seek-buttons/dist/videojs-seek-buttons.css';
    import 'videojs-thumbnail-sprite';
    import { theaterMode } from '@stores/main';

    export let obj;
    export let type;
    export let time;
    export let setNewTime;

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    let player;
    let watched;
    let playerSettings;
    let src =
        type === 'vods'
            ? `${BACKEND_URL}/media/${type}/${obj.filename}-segments/${obj.filename}.m3u8`
            : `${BACKEND_URL}/media/${type}/${obj.filename}-segments/${obj.filename}.m3u8`;
    let poster =
        type === 'vods'
            ? `${BACKEND_URL}/media/${type}/${obj.filename}-lg.jpg`
            : `${BACKEND_URL}/media/${type}/${obj.filename}-lg.jpg`;
    let overlay;
    let overlayMsg = '';
    let timeout;
    let theaterEnabled;

    onMount(() => {
        watched = JSON.parse(localStorage.getItem('watched'));
        if (!watched) {
            watched = {
                vods: {},
                clips: {}
            };
        }
        playerSettings = JSON.parse(localStorage.getItem('player'));
        if (!playerSettings) {
            playerSettings = {
                volume: 1,
                playbackRate: 1
            };
        }

        let options = {
            controlBar: {
                volumePanel: {
                    inline: false
                }
            },
            playbackRates: playbackRates
        };

        // set vtt subtitle
        if (type == 'vods' && obj.transcript !== '') {
            options['tracks'] = [
                {
                    kind: 'captions',
                    label: 'Transcript',
                    language: 'de',
                    src: `${BACKEND_URL}/media/${type}/${obj.filename}.vtt`
                }
            ];
        } else {
            options['tracks'] = [];
        }
        player = videojs('vod', options);
        player.src({
            src: src,
            type: 'application/x-mpegURL'
        });
        player.fluid(true);
        player.seekButtons({
            forward: 10,
            back: 10
        });

        // set sprites
        let sprites = [];
        const sprites_horizontal = 6; // defined by default ffmpeg value for tile
        const sprites_vertical = 5; // defined by default ffmpeg value for tile
        const sprites_per_frame = sprites_horizontal * sprites_vertical;
        const interval = 20; // 1 frame each x seconds
        const duration = sprites_horizontal * sprites_vertical * interval;
        for (
            let index = 1;
            index <= Math.ceil(obj.duration / interval / sprites_per_frame);
            index++
        ) {
            let restDur;
            if (index * duration <= obj.duration) {
                restDur = duration;
            } else {
                // rest duration calculated by total duration - (index*duration) and rouded up to the next interval size (191 would be rounded up to 200) to prevent module warning
                const durationUntilNow = obj.duration - (index - 1) * duration;
                restDur = durationUntilNow + (interval - (durationUntilNow % interval));
            }
            const d = {
                url: `${BACKEND_URL}/media/${type}/${obj.filename}-sprites/${obj.filename}_${index
                    .toString()
                    .padStart(3, '0')}.webp`,
                start: index * duration - duration,
                duration: restDur,
                interval: interval,
                width: 160,
                height: 90
            };
            sprites = [...sprites, d];
        }
        player.thumbnailSprite({
            sprites: sprites
        });

        // Safari has problems with bind:currentTime on the video element and running a function when the var changes. So we use the non svelte way.
        // https://github.com/sveltejs/svelte/issues/6002
        player.on('loadedmetadata', () => {
            player.volume(playerSettings.volume);
            player.muted(playerSettings?.muted);
            player.playbackRate(playerSettings.playbackRate);
            if (time > 0 && time <= obj.duration) {
                player.currentTime(time);
            } else if (watched[type][obj.uuid]) {
                player.currentTime(watched[type][obj.uuid]);
            }
        });
        player.on('timeupdate', () => {
            updateWatched();
        });
        player.on('volumechange', () => {
            updatePlayerSettings();
        });
        player.on('ratechange', () => {
            updatePlayerSettings();
        });
        player.play();

        // smooth scrubbing
        // https://github.com/videojs/video.js/issues/4460#issuecomment-312861657
        const SeekBar = videojs.getComponent('SeekBar');
        SeekBar.prototype.getPercent = function getPercent() {
            const t = this.player_.currentTime();
            const percent = t / this.player_.duration();
            return percent >= 1 ? 1 : percent;
        };
        SeekBar.prototype.handleMouseMove = function handleMouseMove(event) {
            let newTime = this.calculateDistance(event) * this.player_.duration();
            if (newTime === this.player_.duration()) {
                newTime = newTime - 0.1;
            }
            this.player_.currentTime(newTime);
            this.update();
        };

        // set theater mode
        theaterMode.subscribe((newState) => {
            theaterEnabled = newState;
        });

        document.onkeydown = (e) => {
            let searchActive = document.getElementById('searchInput') == document.activeElement;
            if (searchActive) {
                return;
            } else if (e.key === 'f' && !e.ctrlKey) {
                if (player.isFullscreen()) {
                    player.exitFullscreen();
                } else {
                    player.requestFullscreen();
                }
                return false;
            } else if (e.key === ' ') {
                if (player.paused()) {
                    player.play();
                    showOverlay('Play');
                } else {
                    player.pause();
                    showOverlay('Pause');
                }
                return false;
            } else if (e.key === 'ArrowRight') {
                player.currentTime(player.currentTime() + 10);
                showOverlay('+10 Sekunden');
                return false;
            } else if (e.key === 'ArrowLeft') {
                player.currentTime(player.currentTime() - 10);
                showOverlay('-10 Sekunden');
                return false;
            } else if (e.key === 'ArrowUp') {
                player.volume(player.volume() + 0.05);
                showOverlay(`Lautstärke ${Math.round(player.volume() * 100)}%`);
                return false;
            } else if (e.key === 'ArrowDown') {
                player.volume(player.volume() - 0.05);
                showOverlay(`Lautstärke ${Math.round(player.volume() * 100)}%`);
                return false;
            } else if (e.key === 'm') {
                if (player.muted()) {
                    player.muted(false);
                    showOverlay('Laut');
                } else {
                    player.muted(true);
                    showOverlay('Stumm');
                }
                return false;
            } else if (e.key === ',') {
                let rateIndex = playbackRates.indexOf(player.playbackRate());
                if (rateIndex - 1 >= 0 && rateIndex - 1 <= playbackRates.length - 1) {
                    player.playbackRate(playbackRates[rateIndex - 1]);
                    showOverlay(`Geschwindigkeit ${playbackRates[rateIndex - 1]}x`);
                }
                return false;
            } else if (e.key === '.') {
                let rateIndex = playbackRates.indexOf(player.playbackRate());
                if (rateIndex + 1 >= 0 && rateIndex + 1 <= playbackRates.length - 1) {
                    player.playbackRate(playbackRates[rateIndex + 1]);
                    showOverlay(`Geschwindigkeit ${playbackRates[rateIndex + 1]}x`);
                }
                return false;
            } else if (e.key === 't' && !e.ctrlKey) {
                theaterMode.set(!theaterEnabled);
            }
        };
    });

    $: if (player !== undefined && setNewTime !== undefined) {
        time = setNewTime;
        player.currentTime(setNewTime);
        setNewTime = 0;
    }

    onDestroy(() => {
        if (browser) {
            player.dispose();
            document.onkeydown = null;
        }
    });

    function updateWatched() {
        if (watched[type][obj.uuid] === undefined) {
            watched[type][obj.uuid] = 0;
            localStorage.setItem('watched', JSON.stringify(watched));
        } else if (Math.floor(player.currentTime()) != Math.floor(watched[type][obj.uuid])) {
            time = Math.round(player.currentTime());
            watched[type][obj.uuid] = time;
            localStorage.setItem('watched', JSON.stringify(watched));
        }
    }

    function updatePlayerSettings() {
        playerSettings.volume = player.volume();
        playerSettings.muted = player.muted();
        playerSettings.playbackRate = player.playbackRate();
        localStorage.setItem('player', JSON.stringify(playerSettings));
    }

    function showOverlay(msg) {
        if (timeout) {
            clearTimeout(timeout);
        }
        overlayMsg = msg;
        overlay.classList.add('vis');
        timeout = setTimeout(() => {
            overlay.classList.remove('vis');
        }, 1000);
    }
</script>

<div>
    <div
        id="overlay"
        class="position-fixed d-flex align-items-center justify-content-center pe-none"
        bind:this={overlay}
    >
        <div class="msg px-3 py-2 rounded">
            {overlayMsg}
        </div>
    </div>
    <video
        id="vod"
        class="video-js vjs-big-play-centered"
        controls
        preload="none"
        width="100%"
        height="100%"
        {poster}
    >
        <p class="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a web browser
            that
            <a href="https://videojs.com/html5-video-support/" target="_blank" rel="noreferrer"
                >supports HTML5 video</a
            >
        </p>
        <track kind="captions" />
    </video>
</div>

<style lang="scss">
    #overlay {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1030;
        opacity: 0;
        transition: 0.3s;

        &:global(.vis) {
            opacity: 0.9;
        }
    }
</style>
