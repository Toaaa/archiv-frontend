<script>
    import { onMount } from 'svelte';
    import { formatRelative, parseISO } from 'date-fns';
    import { de } from 'date-fns/locale/index.js';
    import { page } from '$app/stores';
    import { db } from '@stores/main';

    let statsDB;

    onMount(() => {
        db.subscribe((newStats) => {
            statsDB = newStats;
        });
    });
</script>

<footer class="footer mt-auto py-3">
    <div class="container">
        <div class="row">
            <div class="col-md mt-3">
                <p class="mb-1 fw-bold fs-6">Letztes Update</p>
                {#if statsDB}
                    <p class="m-0">
                        {formatRelative(parseISO(statsDB?.result?.last_vod_sync), new Date(), {
                            locale: de
                        })} Uhr
                    </p>
                {/if}
            </div>
            <div class="col-md mt-3">
                <p class="mb-1 fw-bold fs-6">Schneile</p>
                <ul class="footer-list">
                    <li>
                        <a
                            href="https://www.twitch.tv/schneiletv"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="Twitch"
                            class="text-decoration-none"
                            >Twitch
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://youtube.com/@Schneile"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="Youtube"
                            class="text-decoration-none"
                            >YouTube
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://discord.gg/buVmT4JX"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="Discord"
                            class="text-decoration-none"
                            >Discord
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://schneile.tv/streamplan"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="Streamplan"
                            class="text-decoration-none"
                            >Streamplan
                        </a>
                    </li>
                </ul>
            </div>
            <div class="col-md mt-3 mb-3">
                <p class="mb-1 fw-bold fs-6">Archiv</p>
                <ul class="footer-list">
                    {#if $page.url.hostname.startsWith('dev.schneile.tv')}
                    <li>
                        <a
                            href="https://archiv.schneile.tv/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="Archiv"
                            class="text-decoration-none"
                            >Archiv
                        </a>
                    </li>
                    {:else}
                    <li>
                        <a
                            href="https://dev.schneile.tv/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="Test Archiv"
                            class="text-decoration-none"
                            >Testseite
                        </a>
                    </li>
                    {/if}
                    <li>
                        <a
                            href="https://status.schneile.tv/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="Status Page"
                            class="text-decoration-none"
                            >Status
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://api.schneile.tv/health"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="API"
                            class="text-decoration-none"
                            >API
                        </a>
                    </li>
                </ul>
            </div>
            <div class="col-md mt-3 mb-3">
                <p class="mb-1 fw-bold fs-6">Kontakt</p>
                <ul class="footer-list">
                    <li>
                        <a
                            href="mailto:kontakt@toaaa.de"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="E-Mail"
                            class="text-decoration-none"
                            >E-Mail
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    {#if $page.url.hostname.startsWith('archiv.schneile.tv')}
        <script
            defer 
            data-domain="archiv.schneile.tv" 
            src="https://p.galaxycrow.de/js/script.js">
        </script>
    {/if}
</footer>
