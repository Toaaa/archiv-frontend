<script>
    import ClipGrid from '@components/ClipGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import SearchPlaceholder from '@components/SearchPlaceholder.svelte';
    import SearchItem from '@components/SearchItem.svelte';
    import Pagination from '@components/Pagination.svelte';
    import SEO from '@components/SEO.svelte';
    import { fetchApi } from '/src/functions';

    export let query;

    let vodsPage = 1;
    let clipsPage = 1;
    let vodsPageSize = 4;
    let clipsPageSize = 18;
    let statsDB = {};
    let ogTags = {
        title: '',
        description: 'Suche',
        imageurl: '/img/og.png',
        imagealt: 'SchneileTV Archiv OG Image'
    };

    $: ogTags.title = 'Suche: ' + query;
    $: {
        // set page to 1 when query changes
        query;
        vodsPage = 1;
        clipsPage = 1;
    }
</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    <div class="container">
        <h1 class="display-4 fw-bolder p-0 align-self-center">Suche</h1>
    </div>
    <div class="container">
        {#await fetchApi(`/vods/?limit=4&page=${vodsPage}&q=${query}`)}
            <div class="row mb-4">
                <div class="col-xs-12 col-md-7">
                    <h3 class="display-6 fw-bolder p-0 m-0 align-self-center">Vods</h3>
                </div>
            </div>
            <p class="text-center text-muted">Suche...</p>
            <SearchPlaceholder count="4" />
        {:then resp}
            {#if resp.error == false}
                <div class="row mb-4">
                    <div class="col-xs-12 col-md-7">
                        <h3 class="display-6 fw-bolder p-0 m-0 align-self-center">
                            Vods <small class="fs-3 text-muted"
                                >({(resp.exec_time / 1000 / 1000 / 1000).toFixed(2)}s)</small
                            >
                        </h3>
                    </div>
                    <div class="col-xs-12 col-md-5 ms-auto col-pages">
                        <p class="fs-4 fw-bold p-0 m-0 align-self-center">
                            {#if resp.result.length >= 1}
                                {(vodsPage - 1) * vodsPageSize + 1} - {(vodsPage - 1) *
                                    vodsPageSize +
                                    resp.result.length} von {resp.page_obj.total_rows}
                                {resp.result.length == 1 ? 'Ergebnis' : 'Ergebnissen'}
                            {:else}
                                0 Ergebnisse
                            {/if}
                        </p>
                    </div>
                </div>
                {#each resp.result as vod, i}
                    <SearchItem {vod} {query} {i} />
                {/each}
                <Pagination obj={resp} bind:p={vodsPage} />
            {:else if resp.error == true}
                <div class="row mb-4">
                    <div class="col-xs-12 col-md-7">
                        <h3 class="display-6 fw-bolder p-0 m-0 align-self-center">
                            Vods <small class="fs-3 text-muted"
                                >({(resp.exec_time / 1000 / 1000 / 1000).toFixed(2)}s)</small
                            >
                        </h3>
                    </div>
                </div>
                <p class="text-center text-muted">Keine Treffer. <a href="faq/">VOD nicht gefunden?</a></p>
            {/if}
        {:catch}
            <div class="row mb-4">
                <div class="col-xs-12 col-md-7">
                    <h3 class="display-6 fw-bolder p-0 m-0 align-self-center">Vods</h3>
                </div>
            </div>

            <p class="text-center text-muted">Error</p>
        {/await}
    </div>
    <div class="container">
        {#await fetchApi(`/clips/?limit=${clipsPageSize}&page=${clipsPage}&title=${query}`)}
            <div class="row mb-4">
                <div class="col-xs-12 col-md-7">
                    <h3 class="display-6 fw-bolder p-0 m-0 align-self-center">Vods</h3>
                </div>
            </div>
            <p class="text-center text-muted">Suche...</p>
            <GridPlaceholder count="12" />
        {:then resp}
            {#if resp.error == false}
                <div class="row mb-4">
                    <div class="col-auto">
                        <h3 class="display-6 fw-bolder p-0 m-0 align-self-center">Clips</h3>
                    </div>
                    <div class="col-xs-12 col-md-5 ms-auto col-pages">
                        <p class="fs-4 fw-bold p-0 m-0 align-self-center">
                            {#if resp.result.length >= 1}
                                {(clipsPage - 1) * clipsPageSize + 1} - {(clipsPage - 1) *
                                    clipsPageSize +
                                    resp.result.length} von {resp.page_obj.total_rows}
                                {resp.result.length == 1 ? 'Ergebnis' : 'Ergebnissen'}
                            {:else}
                                0 Ergebnisse
                            {/if}
                        </p>
                    </div>
                </div>
                <ClipGrid clips={resp.result} {query} />
                <Pagination obj={resp} bind:p={clipsPage} />
            {:else if resp.error == true}
                <div class="row mb-4">
                    <div class="col-xs-12 col-md-7">
                        <h3 class="display-6 fw-bolder p-0 m-0 align-self-center">Clips</h3>
                    </div>
                </div>
                <p class="text-center text-muted">Keine Treffer</p>
            {/if}
        {:catch}
            <div class="row mb-4">
                <div class="col-xs-12 col-md-7">
                    <h3 class="display-6 fw-bolder p-0 m-0 align-self-center">Clips</h3>
                </div>
            </div>
            <p class="text-center text-muted">Error</p>
        {/await}
    </div>
</main>
