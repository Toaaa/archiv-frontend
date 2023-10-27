<script>
    import { fetchApi } from '/src/functions';
    import VodGrid from '@components/VodGrid.svelte';
    import ClipGrid from '@components/ClipGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import SEO from '@components/SEO.svelte';
    import { bookmarkStore } from '@stores/bookmarks';

    let statsDB = {};
    let ogTags = {
        title: 'Bookmarks • SchneileTV',
        description: 'Twitch VOD Archiv von Schneile',
        imageurl: '/img/og.png',
        imagealt: 'SchneileTV Archiv OG Image'
    };
    let bookmarks;

    bookmarkStore.subscribe((bm) => {
        bookmarks = bm;
    });

    $: bookmarkStore.set(bookmarks);
</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    <div class="container">
        {#if bookmarks?.vods.length > 0}
            <div class="row">
                <div class="col">
                    <h1 class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center">
                        <p>Gemerkte Vods</p>
                    </h1>
                </div>
                <div class="col text-end align-self-center">
                    <button
                        class="btn btn-light"
                        on:click={() => (bookmarks.vods = [])}
                        on:keydown={() => (bookmarks.vods = [])}>Alle Vods löschen</button
                    >
                </div>
            </div>
            {#await fetchApi(`/vods/?uuids=${bookmarks.vods.join(',')}`)}
                <GridPlaceholder count="4" />
            {:then resp}
                <VodGrid vods={resp.result} offset="" />
            {/await}
        {/if}
        {#if bookmarks?.clips.length > 0}
            <div class="row">
                <div class="col">
                    <h1 class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center">
                        <p>Gemerkte Clips</p>
                    </h1>
                </div>
                <div class="col text-end align-self-center">
                    <button
                        class="btn btn-light"
                        on:click={() => (bookmarks.clips = [])}
                        on:keydown={() => (bookmarks.clips = [])}>Alle Clips löschen</button
                    >
                </div>
            </div>
            {#await fetchApi(`/clips/?uuids=${bookmarks.clips.join(',')}`)}
                <GridPlaceholder count="4" />
            {:then resp}
                <ClipGrid clips={resp.result} query="" />
            {/await}
        {/if}
        {#if bookmarks?.vods.length === 0 && bookmarks?.clips.length === 0}
            <h1 class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center">
                <p>Keine Lesezeichen gefunden</p>
            </h1>
            <GridPlaceholder count="3" />
        {/if}
    </div>
</main>
