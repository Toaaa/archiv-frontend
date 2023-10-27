<script>
    import { fetchApi } from '/src/functions';
    import { onMount } from 'svelte';
    import { format, parseISO } from 'date-fns';
    import { formatBytes, parseShareTime } from '/src/functions.js';
    import Player from '@components/Player.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import VodGrid from '@components/VodGrid.svelte';
    import BookmarkButton from '@components/BookmarkButton.svelte';
    import ShareButton from '@components/ShareButton.svelte';
    import HotkeyModal from '@components/HotkeyModal.svelte';
    import SEO from '@components/SEO.svelte';
    import { emotes, showEmotesInTitle } from '@stores/emotes';
    import { toHHMMSS } from '/src/functions';

    import Alert from '@components/Alert.svelte';

    export let data;
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    let clip = data.clip;
    let time = 0;
    let statsDB = {};
    let ogTags = {
        title: clip.title,
        description: `Clip von ${clip.creator.name} mit ${clip.viewcount} Views`,
        imageurl: `${BACKEND_URL}/media/clips/${clip.filename}-lg.jpg`,
        imagealt: 'Clip Thumbnail'
    };

    const spoilerStrings = ['TEARS', 'KINGDOM', 'TOTK', 'TEARS OF THE KINGDOM'];

    function containsSpoilerString(title) {
        const regex = new RegExp(spoilerStrings.join('|'), 'i');
        return regex.test(title);
    }

    onMount(() => {
        time = parseShareTime(window.location.search);
    });
</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    {#await showEmotesInTitle(clip.title, $emotes)}
        {clip.title}
    {:then newTitle}
        {#if containsSpoilerString(newTitle) || clip.game.name == "The Legend of Zelda: Tears of the Kingdom"}
            <div class="container">
                <div class="spoiler-alert-box">
                    <Alert
                          level="danger"
                          title="Spoiler Alarm!"
                          subtitle="Dieser Clip könnte Spoiler zu The Legend of Zelda: Tears of the Kingdom enthalten."
                        />
                </div>
            </div>
        {/if}
    {/await}
    <div class="container">
        <div class="mb-4">
            <div class="row">
                <div class="col-12">
                    <Player bind:time obj={clip} type="clips" />
                </div>
            </div>
        </div>
        <div class="vod-infos mb-4">
            <div class="d-flex title-container">
                <div>
                    <p class="display-6 fw-bolder">
                        {#await showEmotesInTitle(clip.title, $emotes)}
                            {clip.title}
                        {:then newTitle}
                            {@html newTitle}
                        {/await}
                    </p>
                    <div class="row align-items-center">
                        <div class="col-auto me-3">
                            {#if clip.game}
                                <img
                                    src="{BACKEND_URL}/media/games/{clip.game.uuid}.jpg"
                                    alt={clip.game.name}
                                    loading="lazy"
                                />
                            {:else}
                                <img
                                    src="/img/travoltacheck.gif"
                                    alt="Unbekanntes Spiel"
                                    loading="lazy"
                                />
                            {/if}
                        </div>
                        <div class="col-auto">
                            <div class="row">
                                <div class="col">
                                    <div>
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
                                        {format(parseISO(clip.date), 'dd.MM.yyyy - HH:mm')} Uhr
                                    </div>
                                    <div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            class="bi bi-eye-fill"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"
                                            />
                                            <path
                                                d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
                                            />
                                        </svg>
                                        {clip.viewcount} Views
                                    </div>
                                    <div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            class="bi bi-person-fill"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                                            />
                                        </svg>
                                        {clip.creator.name}
                                    </div>
                                    <div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            class="bi bi-tag-fill"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
                                            />
                                        </svg>
                                        {#if clip.game}
                                            {clip.game.name}
                                        {:else}
                                            Unbekannt
                                        {/if}
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col lh-lg mt-2">
                                    <button
                                        class="btn btn-sm"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseExample"
                                        aria-expanded="false"
                                        aria-controls="collapseExample"
                                    >
                                        Mehr anzeigen
                                    </button>
                                    <BookmarkButton uuid={clip.uuid} type="clips" />
                                    <a
                                        href="{BACKEND_URL}/download/clips/{clip.uuid}"
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
                                        Download (~{formatBytes(clip.size)})
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
                                    <HotkeyModal />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex gap-2 ms-auto">
                    <ShareButton bind:time />
                </div>
            </div>
            <p class="collapse text-muted mt-2" id="collapseExample">
                Auflösung: {clip.resolution}<br />
                Bitrate: {Math.round(((clip.size * 8) / clip.duration / 1000 / 1000) * 10) /
                    10}Mbit/s<br />
                Größe: {formatBytes(clip.size)}
            </p>
        </div>
        {#if clip.vod.uuid}
            <hr class="my-4" />
            {#if clip.vod_offset}
                <p class="display-6 fw-bolder">
                    Zur Stelle ({toHHMMSS(clip.vod_offset)}) im Vod springen:
                </p>
            {:else}
                <p class="display-6 fw-bolder">Zum Vod springen:</p>
            {/if}
            {#await fetchApi(`/vods/?uuids=${clip.vod.uuid}`)}
                <GridPlaceholder count="1" />
            {:then resp}
                <VodGrid vods={resp.result} offset={clip.vod_offset} />
            {/await}
            <hr class="my-4" />
        {/if}
    </div>
</main>

<style lang="scss">
    @media screen and (max-width: 767px) {
        .title-container {
            display: block !important;
        }
    }
</style>
