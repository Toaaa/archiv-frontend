<script>
    import SEO from '@components/SEO.svelte';
    import { format, parseISO } from 'date-fns';
    import { emotes, showEmotesInTitle } from '@stores/emotes';
    import { fetchApi, toHHMMSS } from '/src/functions';

    let vodCount = 0;
    let vods = {};

    let statsDB = {};
    let ogTags = {
        title: 'Jahresansicht  • SchneileTV',
        description: 'Twitch VOD Archiv von Schneile',
        imageurl: '/img/og.png',
        imagealt: 'SchneileTV Archiv OG Image'
    };

    async function fetchYears() {
        const resp = await fetchApi('/years');
        const y = resp.result;
        y.forEach((element) => {
            vodCount += element.count;
        });
        return y;
    }

    async function fetchVods(y) {
        if (y in vods) {
            return;
        }
        const resp = await fetchApi(`/vods/?year=${y}`);
        vods[y] = resp.result;
    }
</script>

<SEO bind:ogTags bind:statsDB />

<div class="container">
    <h1 class="display-4 fw-bold pb-3">
        Jahresansicht
        <small class="text-muted">Gesamt: {vodCount}</small>
    </h1>
    <div class="accordion" id="accordionPanelsStayOpenExample">
        {#await fetchYears()}
            <div class="text-center mb-3">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Lade...</span>
                </div>
            </div>
        {:then years}
            {#each years as year}
                <div class="accordion-item" on:mouseenter={() => fetchVods(year.year)}>
                    <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                        <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapse-{year.year}"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapse-{year.year}"
                        >
                            <span class="fw-bold pe-1">{year.year}</span> ({year.count})
                        </button>
                    </h2>
                    <div
                        id="panelsStayOpen-collapse-{year.year}"
                        class="accordion-collapse collapse"
                        aria-labelledby="panelsStayOpen-headingOne"
                    >
                        <div class="accordion-body">
                            <div class="container">
                                {#if vods[year.year]}
                                    {#each vods[year.year] as vod}
                                        <div class="row py-2">
                                            <div class="col-md-auto">
                                                {format(parseISO(vod.date), 'dd.MM.yyyy - HH:mm')} Uhr
                                            </div>
                                            <div class="col order-first order-md-last fw-bold">
                                                <a href="/vods/watch/{vod.uuid}">
                                                    {#await showEmotesInTitle(vod.title, $emotes)}
                                                        {vod.title}
                                                    {:then newTitle}
                                                        {@html newTitle}
                                                    {/await}
                                                </a>
                                            </div>
                                            <div class="col-md-auto order-sm-last">
                                                <span class="me-2">
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
                                                    {vod.viewcount.toLocaleString()}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    class="bi bi-stopwatch"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z"
                                                    />
                                                    <path
                                                        d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3z"
                                                    />
                                                </svg>
                                                {toHHMMSS(vod.duration, false)}
                                            </div>
                                        </div>
                                        <hr class="my-2 mx-0" />
                                    {:else}
                                        <div class="row py-2">
                                            <div class="col-md-auto">
                                                Keine Vods in {year.year}
                                            </div>
                                        </div>
                                    {/each}
                                {:else}
                                    <div class="row py-2">
                                        <div class="col-md-auto">Lade Vods...</div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        {/await}
    </div>
</div>

<style lang="scss">
    .accordion-item {
        border-color: var(--color-main);
        color: var(--color-main);
        background-color: var(--color-background);
    }

    .accordion-button {
        color: var(--color-main);
        background-color: var(--color-background);

        &:hover {
            background-color: var(--color-hover);
        }

        &:focus {
            color: inherit;
            box-shadow: none;
        }

        &:not(.collapsed) {
            color: var(--color-background);
            background-color: var(--color-main);
        }

        &::after {
            background-image: var(--accordion-button);
        }

        &:not(.collapsed)::after {
            background-image: var(--accordion-button);
            filter: invert(1);
        }
    }
</style>
