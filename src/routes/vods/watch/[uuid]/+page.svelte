<script>
    import { onMount } from 'svelte';
    import { format, parseISO } from 'date-fns';
    import { formatBytes, parseShareTime, SrtTimecodeToSeconds } from '/src/functions';
    import Player from '@components/Player.svelte';
    import Chat from '@components/Chat.svelte';
    import BookmarkButton from '@components/BookmarkButton.svelte';
    import ShareButton from '@components/ShareButton.svelte';
    import HotkeyModal from '@components/HotkeyModal.svelte';
    import SEO from '@components/SEO.svelte';
    import ClipGrid from '@components/ClipGrid.svelte';
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import { emotes, showEmotesInTitle } from '@stores/emotes';
    import { theaterMode } from '@stores/main';

    export let data;
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    let vod = data.vod;
    let time = 0;
    let setNewTime;
    let statsDB = {};
    let ogTags = {
        title: vod.title,
        description: `Vod vom ${format(parseISO(vod.date), 'dd.MM.yyyy')}`,
        imageurl: `${BACKEND_URL}/media/vods/${vod.filename}-lg.jpg`,
        imagealt: 'Vod Thumbnail'
    };
    let transcriptList = [];
    let transcriptStart;
    let transcriptEnd;
    let chat = true;
    let showChat = false;
    let theaterEnabled;

    onMount(() => {
        time = parseShareTime(window.location.search);
        transcriptList = vod.transcript.split('\n').filter((line) => line !== '');

        theaterMode.subscribe((newState) => {
            theaterEnabled = newState;
        });
    });

    function lineHasTimecode(line) {
        const matches = new RegExp('(\\d+):(\\d+):(\\d+),(\\d+)', 'g').test(line);
        return matches;
    }
</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    <div class={theaterEnabled ? 'container-fluid' : 'container'}>
        <div class="mb-4">
            <div class="row">
                <div
                    class="col-12 {showChat
                        ? theaterEnabled
                            ? 'col-lg-9 col-xl-10'
                            : 'col-lg-9'
                        : ''}"
                >
                    <Player bind:time bind:setNewTime obj={vod} type="vods" />
                </div>
                {#if showChat && chat}
                    <div
                        class="col-12 {theaterEnabled
                            ? 'col-lg-3 col-xl-2'
                            : 'col-lg-3'} position-relative d-flex justify-content-center"
                    >
                        <Chat bind:vod bind:playerTime={time} bind:showChat />
                    </div>
                {/if}
            </div>
        </div>
    </div>
    <div class="container">
        <div class="vod-infos mb-4">
            <div class="d-flex title-container">
                <div>
                    <p class="display-6 fw-bolder">
                        {#await showEmotesInTitle(vod.title, $emotes)}
                            {vod.title}
                        {:then newTitle}
                            {@html newTitle}
                        {/await}
                    </p>
                    <p class="text-muted m-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-calendar-date-fill"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zm5.402 9.746c.625 0 1.184-.484 1.184-1.18 0-.832-.527-1.23-1.16-1.23-.586 0-1.168.387-1.168 1.21 0 .817.543 1.2 1.144 1.2z"
                            />
                            <path
                                d="M16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-6.664-1.21c-1.11 0-1.656-.767-1.703-1.407h.683c.043.37.387.82 1.051.82.844 0 1.301-.848 1.305-2.164h-.027c-.153.414-.637.79-1.383.79-.852 0-1.676-.61-1.676-1.77 0-1.137.871-1.809 1.797-1.809 1.172 0 1.953.734 1.953 2.668 0 1.805-.742 2.871-2 2.871zm-2.89-5.435v5.332H5.77V8.079h-.012c-.29.156-.883.52-1.258.777V8.16a12.6 12.6 0 0 1 1.313-.805h.632z"
                            />
                        </svg>
                        {format(parseISO(vod.date), 'dd.MM.yyyy - HH:mm')} Uhr
                    </p>
                    <p class="text-muted">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-eye-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                            <path
                                d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
                            />
                        </svg>
                        {vod.viewcount.toLocaleString()} Views
                    </p>
                </div>
                <div class="d-flex gap-2 ms-auto">
                    <ShareButton bind:time />
                </div>
            </div>
            <div>
                <p class="lh-lg">
                    <button
                        class="btn btn-sm"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#moreInfos"
                        aria-expanded="false"
                        aria-controls="moreInfos"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-file-earmark-bar-graph-fill"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm.5 10v-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1z"
                            />
                        </svg>
                        Metadaten
                    </button>
                    <!-- {#if vod.transcript != ''}
                        <button
                            class="btn btn-sm"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#showTranscript"
                            aria-expanded="false"
                            aria-controls="showTranscript"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-chat-quote-fill"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM7.194 6.766a1.688 1.688 0 0 0-.227-.272 1.467 1.467 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 5.734 6C4.776 6 4 6.746 4 7.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26-.137.389-.39.804-.81 1.22a.405.405 0 0 0 .011.59c.173.16.447.155.614-.01 1.334-1.329 1.37-2.758.941-3.706a2.461 2.461 0 0 0-.227-.4zM11 9.073c-.136.389-.39.804-.81 1.22a.405.405 0 0 0 .012.59c.172.16.446.155.613-.01 1.334-1.329 1.37-2.758.942-3.706a2.466 2.466 0 0 0-.228-.4 1.686 1.686 0 0 0-.227-.273 1.466 1.466 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 10.07 6c-.957 0-1.734.746-1.734 1.667 0 .92.777 1.666 1.734 1.666.343 0 .662-.095.931-.26z"
                                />
                            </svg> Transcript
                        </button>
                    {/if} -->
                    <BookmarkButton uuid={vod.uuid} type="vods" />
                    <a
                        href="{BACKEND_URL}/download/vods/{vod.uuid}"
                        class="btn btn-sm"
                        rel="external"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-download"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
                            />
                            <path
                                d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
                            />
                        </svg>
                        Download (~{formatBytes(vod.size)})
                    </a>
                    <button
                        type="button"
                        class="btn btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#hotkeyModal"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-keyboard"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z"
                            />
                            <path
                                d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm0-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5 0A.25.25 0 0 1 8.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 8 8.75v-.5zm2 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-.5zm1 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5-2A.25.25 0 0 1 6.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 6 8.75v-.5zm-2 0A.25.25 0 0 1 4.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 4 8.75v-.5zm-2 0A.25.25 0 0 1 2.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 8.75v-.5zm11-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0A.25.25 0 0 1 9.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 9 6.75v-.5zm-2 0A.25.25 0 0 1 7.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 7 6.75v-.5zm-2 0A.25.25 0 0 1 5.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 5 6.75v-.5zm-3 0A.25.25 0 0 1 2.25 6h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5A.25.25 0 0 1 2 6.75v-.5zm0 4a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm2 0a.25.25 0 0 1 .25-.25h5.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-5.5a.25.25 0 0 1-.25-.25v-.5z"
                            />
                        </svg>
                        Hotkeys
                    </button>
                    {#if chat}
                     <button
                        type="button"
                        class="btn btn-sm"
                        on:click={() => (showChat = !showChat)}
                        on:keypress={() => (showChat = !showChat)}
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-chat"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"
                            />
                        </svg> Toggle Chat
                    </button>
                    {/if}
                    <button
                        type="button"
                        class="btn btn-sm"
                        on:click={() => (theaterEnabled = !theaterEnabled)}
                        on:keypress={() => (theaterEnabled = !theaterEnabled)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-arrows-fullscreen"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"
                            />
                        </svg> Theater Mode
                    </button>
                    <HotkeyModal />
                </p>
                <div class="collapse text-muted" id="moreInfos">
                    Auflösung: {vod.resolution}<br />
                    Bitrate: {Math.round(((vod.size * 8) / vod.duration / 1000 / 1000) * 10) /
                        10}Mbit/s<br />
                    FPS: {vod.fps}<br />
                    Größe: {formatBytes(vod.size)}
                </div>
            </div>
            {#if vod.clips.length}
                <hr class="my-4" />
                <p class="display-6 fw-bolder">Clips für dieses Vod:</p>
                <ClipGrid clips={vod.clips} query="" />
            {/if}
        </div>
    </div>
</main>

<style lang="scss">
    .alert {
        background-color: var(--color-nav-background);
    }

    .script-timecode,
    .script-text {
        &:hover {
            background-color: var(--color-nav-background);
        }
    }

    .script-container {
        height: 30vh;
    }

    @media screen and (max-width: 767px) {
        .title-container {
            display: block !important;
        }
    }
</style>
