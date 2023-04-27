<script>
    export let obj;
    export let p;

    function range(start, end) {
        return Array(end - start + 1)
            .fill()
            .map((_, idx) => start + idx);
    }
</script>

<nav aria-label="Pagination">
    <ul class="pagination justify-content-center">
        {#if p > 1}
            <li class="page-item">
                <div
                    class="page-link"
                    role="button"
                    tabindex="0"
                    on:click={() => (p = 1)}
                    on:keyup={() => (p = 1)}
                >
                    Erste
                </div>
            </li>
            <li class="page-item pagination-ellipsis text-center">
                <span>&hellip;</span>
            </li>
        {/if}
        {#each range(1, obj.page_obj.total_pages) as i}
            {#if i <= p + 2 && i >= p - 2}
                {#if p == i}
                    <li class="page-item active">
                        <div
                            class="page-link"
                            role="button"
                            tabindex="0"
                            on:click={() => (p = i)}
                            on:keyup={() => (p = i)}
                        >
                            {i}
                        </div>
                    </li>
                {:else}
                    <li class="page-item">
                        <div
                            class="page-link"
                            role="button"
                            tabindex="0"
                            on:click={() => (p = i)}
                            on:keyup={() => (p = i)}
                        >
                            {i}
                        </div>
                    </li>
                {/if}
            {/if}
        {/each}
        {#if p < obj.page_obj.total_pages}
            <li class="page-item pagination-ellipsis text-center">
                <span>&hellip;</span>
            </li>
            <li class="page-item">
                <div
                    class="page-link"
                    role="button"
                    tabindex="0"
                    on:click={() => (p = obj.page_obj.total_pages)}
                    on:keyup={() => (p = obj.page_obj.total_pages)}
                >
                    Letzte
                </div>
            </li>
        {/if}
    </ul>
</nav>

<style lang="scss">
    .page-link {
        color: var(--color-main);
        background-color: var(--color-background);

        &:hover {
            color: var(--color-background);
            background-color: var(--color-main);
        }

        &:focus {
            color: var(--color-background);
            background-color: var(--color-main);
            box-shadow: none;
        }
    }

    .page-item {
        &.active .page-link {
            background-color: var(--color-main);
            border-color: var(--color-main);
            color: var(--color-background);
        }
    }
    .pagination-ellipsis {
        width: 35px !important;
    }
</style>
