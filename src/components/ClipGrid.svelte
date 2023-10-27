<script>
    import VideoThumbnail from './VideoThumbnail.svelte';
    import { format, formatDistanceToNow, parseISO } from 'date-fns';
    import { de } from 'date-fns/locale/index.js';
    import { emotes, showEmotesInTitle } from '@stores/emotes';

    export let clips;
    export let query;
</script>

<div class="row">
    {#each clips as clip, i}
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2 mb-2">
            <div class="card card-rounded h-100 p-1">
                <div class="position-relative">
                    <VideoThumbnail
                        type="clips"
                        filename={clip.filename}
                        title={clip.title}
                        uuid={clip.uuid}
                        duration={clip.duration}
                        loading={i > 7 ? 'lazy' : 'auto'}
                        offset=""
                        highres="false"
                    />
                </div>
                <div class="card-body">
                    <a href="/clips/watch/{clip.uuid}">
                        <p class="h5 m-0 matched-string">
                            {#if query == ''}
                                {#await showEmotesInTitle(clip.title, $emotes)}
                                    {clip.title}
                                {:then newTitle}
                                    {@html newTitle}
                                {/await}
                            {:else}
                                {@html clip.title.replace(
                                    new RegExp(query, 'gi'),
                                    (match) => `<span>${match}</span>`
                                )}
                            {/if}
                        </p>
                    </a>
                    <div
                        class="card-text text-muted"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={format(parseISO(clip.date), 'dd.MM.yyyy HH:mm:ss')}
                    >
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
                        {formatDistanceToNow(parseISO(clip.date), { locale: de })},
                        {format(parseISO(clip.date), 'HH:mm')} Uhr
                    </div>
                    <div class="card-text text-muted">
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
                        <span class="me-1">{clip.viewcount.toLocaleString()}</span>
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
                </div>
            </div>
        </div>
    {:else}
        <div class="col">
            <img src="/img/travoltacheck.gif" alt="travoltacheck" width="110" height="110" />
        </div>
    {/each}
</div>

<style lang="scss">
    .matched-string {
        :global(span) {
            background-color: var(--color-matched-string);
            border-radius: 5px;
            padding: 0.1em;
        }
    }

    .card {
        &:hover {
            background-color: var(--color-hover);
        }
    }
</style>
