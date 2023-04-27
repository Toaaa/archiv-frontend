<script>
    import SEO from '@components/SEO.svelte';
    import VodGrid from '@components/VodGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import Pagination from '@components/Pagination.svelte';
    import { fetchApi } from '/src/functions';

    let vods;
    let p = 1;
    let statsDB = {};
    let ogTags = {
        title: 'Alle Vods • SchneileTV',
        description: 'Twitch VOD Archiv von Schneile',
        imageurl: '/img/og.png',
        imagealt: 'SchneileTV Archiv OG Image'
    };

    async function fetchVods(p) {
        vods = await fetchApi(`/vods/?limit=48&page=${p}`);
        window.scrollTo(0, 0);
        return vods;
    }
</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    <div class="container">
        <div class="row mb-4">
            <div class="col-xs-12 col-md-8">
                <h1 class="display-4 fw-bolder p-0 m-0 align-self-center">Alle Vods</h1>
            </div>
            {#if vods}
                <div class="col-xs-12 col-md-4 col-pages">
                    <p class="fs-4 fw-bold mb-2 pb-3">
                        Seite {vods.page_obj.page} von {vods.page_obj.total_pages}
                    </p>
                </div>
            {/if}
        </div>
        {#await fetchVods(p)}
            <GridPlaceholder count="48" />
        {:then resp}
            <VodGrid vods={resp.result} offset="" />
            <Pagination obj={resp} bind:p />
        {/await}
    </div>
</main>
