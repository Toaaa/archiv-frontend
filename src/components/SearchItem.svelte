<script>
    import VideoThumbnail from '@components/VideoThumbnail.svelte';
    import { format, formatDistanceToNow, parseISO } from 'date-fns';
    import { de } from 'date-fns/locale/index.js';
    import { SrtTimecodeToSeconds } from '/src/functions.js';

    export let vod;
    export let query;
    export let i;
</script>

<div class="card mb-3 p-2">
    <div class="row g-3">
        <div class="col-lg-3">
            <VideoThumbnail
                type="vods"
                filename={vod.filename}
                title={vod.title}
                uuid={vod.uuid}
                duration={vod.duration}
                loading={i > 7 ? 'lazy' : 'auto'}
                offset=""
                highres="true"
            />
        </div>
        <div class="col-lg-9">
            <div class="card-body pt-0">
                <a href="/vods/watch/{vod.uuid}">
                    <h5 class="card-title matched-string">
                        {@html vod.title_matches.replace(
                            new RegExp(query, 'gi'),
                            (match) => `<span>${match}</span>`
                        )}
                    </h5>
                </a>
                <div class="card-text matched-string match-box">
                    {#if vod.transcript_matches != ''}
                        {@html vod.transcript_matches.replace(
                            new RegExp('(\\d+):(\\d+):(\\d+)(,|\\.)(\\d+)', 'g'),
                            (match) =>
                                `<a class="text-muted" href="/vods/watch/${
                                    vod.uuid
                                }/?t=${SrtTimecodeToSeconds(match)}">${match}</a>`
                        )}
                    {:else}
                        <p class="text-muted"><i>Noch kein Skript. Coming soon...</i></p>
                    {/if}
                </div>
                <div
                    class="card-text text-muted"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={format(parseISO(vod.date), 'dd.MM.yyyy HH:mm:ss')}
                >
                    <span class="me-3">
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
                        {formatDistanceToNow(parseISO(vod.date), { locale: de })},
                        {format(parseISO(vod.date), 'HH:mm')} Uhr
                    </span>
                    <span class="me-3">
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
                        {vod.viewcount.toLocaleString()}
                    </span>
                    <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-graph-up"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"
                            />
                        </svg>
                        {(vod.title_rank + vod.transcript_rank).toFixed(1)} Search Score
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .card {
        &:hover {
            background-color: var(--color-hover);
        }
    }

    .matched-string {
        :global(span) {
            background-color: var(--color-matched-string);
            border-radius: 5px;
            padding: 0.1em;
        }
    }

    .match-box {
        white-space: pre-line;

        :global(a) {
            text-decoration: underline;
        }
    }
</style>
