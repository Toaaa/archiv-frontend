<script>
    import VideoThumbnail from '@components/VideoThumbnail.svelte';
    import { format, formatDistanceToNow, parseISO } from 'date-fns';
    import { de } from 'date-fns/locale/index.js';
    import { emotes, showEmotesInTitle } from '@stores/emotes';

    export let vods;
</script>

<div class="card mx-2 mb-3 rounded-4 p-3">
    <div class="row gx-5 align-items-center">
        <div class="col-md-4">
            <VideoThumbnail
                type="vods"
                filename={vods[0].filename}
                title={vods[0].title}
                uuid={vods[0].uuid}
                duration={vods[0].duration}
                loading="auto"
                offset=""
                highres="true"
            />
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <a href="/vods/watch/{vods[0].uuid}">
                    <h2 class="display-5 fw-bold">Aktuellster Stream</h2>
                    {#await showEmotesInTitle(vods[0].title, $emotes)}
                        <h2 class="card-title">{vods[0].title}</h2>
                    {:then newTitle}
                        <h2 class="card-title">{@html newTitle}</h2>
                    {/await}
                </a>
                <div
                    class="card-text text-muted"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={format(parseISO(vods[0].date), 'dd.MM.yyyy HH:mm:ss')}
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
                    {formatDistanceToNow(parseISO(vods[0].date), { locale: de })},
                    {format(parseISO(vods[0].date), 'HH:mm')} Uhr
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
                    {vods[0].viewcount.toLocaleString()}
                </div>
                <a class="btn mt-3 fw-bold" href="/vods/watch/{vods[0].uuid}">
                    Jetzt ansehen
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-play-circle-fill"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"
                        />
                    </svg>
                </a>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
.card {
    background-color: var(--color-nav-background);
    box-shadow: 7px 5px 0px var(--color-alert-success);
}

.btn {
    background-color: var(--color-alert-success);
    border: none;
    transition: box-shadow 0.3s ease;

    &:hover {
        animation: btn-shadow 0.2s forwards;
    }

    &:not(:hover) {
        animation: btn-shadow-reverse 0.2s forwards;
    }
}

@keyframes btn-shadow {
    0% {
        box-shadow: 7px 5px 0px var(--color-alert-success);
    }
    50% {
        box-shadow: 10px 8px 0px var(--color-alert-success);
    }
    100% {
        box-shadow: 7px 5px 0px var(--color-alert-success);
    }
}

@keyframes btn-shadow-reverse {
    0% {
        box-shadow: 7px 5px 0px var(--color-alert-success);
    }
    50% {
        box-shadow: 10px 8px 0px var(--color-alert-success);
    }
    100% {
        box-shadow: 0px 0px 0px var(--color-alert-success);
    }
}

</style>
