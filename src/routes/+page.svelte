<script>
    import { fetchApi } from '/src/functions';
    import { page } from '$app/stores';
    import VodGrid from '@components/VodGrid.svelte';
    import ClipGrid from '@components/ClipGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import NewestVod from '@components/NewestVod.svelte';
    import Alert from '@components/Alert.svelte';
    import SEO from '@components/SEO.svelte';
    import { subMonths, startOfDay } from 'date-fns';

    let statsDB = {};
    let ogTags = {
        title: 'Twitch Archiv • SchneileTV',
        description: 'Twitch Archiv von Schneile. Hier findest du alle VODs und Clips. Die Volltextsuche hilft dir dabei das richtige Video zu finden.',
        imageurl: '/img/og.png',
        imagealt: 'SchneileTV Archiv OG Image'
    };
    let apiError = false;
    let beta = false;
    let dev = false;
    let is_live = true;

</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    <div class="container">
        {#if beta && $page.url.hostname.startsWith('archiv.schneile.tv')}
            <Alert
                bind:this={beta}
                level="beta"
                title="Wir sind in der Beta"
                subtitle="Das Archiv ist noch sehr jung und befindet sich daher aktuell noch in der Beta. Es kann daher zu unerwarteten Komplikationen beim benutzten des Archivs kommen. Falls du Fragen oder Probleme hast, melde dich bitte bei der Kontakt-E-Mail im Footer."
            />
        {/if}
        {#if $page.url.hostname.startsWith('dev.schneile.tv')}
            <Alert
                bind:this={dev}
                level="attention"
                title="Du befindest dich auf der Test Seite!"
                subtitle="Falls du hier her weitergeleitet wurdest, obwohl du das gar nicht wolltest, bedeutet das, dass die Hauptseite <b>momentan</b> nicht erreichbar ist. <br>Du kannst den Status <a href='https://status.schneile.tv/' target='_blank' class='alert-link'>hier</a> prüfen."
            />
        {/if}
        {#if statsDB?.result?.is_live}
            <Alert
                bind:this={apiError}
                level="success"
                title="Der Boss ist live!"
                subtitle="Hier gehts zum Stream: <a href='https://www.twitch.tv/schneiletv' class='alert-link'>twitch.tv/schneiletv</a>"
            />
        {/if}
        {#await fetchApi('/vods/?limit=13')}
            <GridPlaceholder count="12" />
        {:then resp}
            <NewestVod vods={resp.result} />
            <h1 class="display-4 fw-bolder p-0 m-0 mt-5 mb-2 align-self-center">
                <a href="/vods/all" class="text-decoration-none" style="color:hover: var(--color-main);">Kürzliche Vods</a>
            </h1>
            <VodGrid vods={resp.result.filter((vod) => vod !== resp.result[0])} offset="" />
        {:catch}
            <Alert
                bind:this={apiError}
                level="danger"
                title="API nicht erreichbar!"
                subtitle="Status <a href='https://status.schneile.tv/' target='_blank' class='alert-link'>hier</a> prüfen."
            />
        {/await}
    </div>
    <div class="container">
        {#await fetchApi('/vods/?limit=12&order=viewcount,desc')}
            <GridPlaceholder count="12" />
        {:then resp}
            <h1 class="display-4 fw-bolder p-0 m-0 mt-5 mb-2 align-self-center">
                <a href="/vods/popular" class="text-decoration-none" style="color:hover: var(--color-main);">Meist geschaute Vods</a>
            </h1>
            <VodGrid vods={resp.result} offset="" />
        {/await}
    </div>
    <div class="container">
        {#await fetchApi(`/clips/?limit=12&order=viewcount,desc&date_from=${startOfDay(subMonths(Date.now(), 1)).toISOString()}`)}
            <GridPlaceholder count="12" />
        {:then resp}
            <h1 class="display-4 fw-bolder p-0 m-0 mt-5 mb-2 align-self-center">
                <a href="/clips" class="text-decoration-none" style="color:hover: var(--color-main);">Top Clips letzter Monat</a>
            </h1>
            <ClipGrid clips={resp.result} query="" />
        {/await}
    </div>
</main>