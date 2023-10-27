<script>
    import { getRandomInt } from '/src/functions';

    export let count;
</script>

<div class="row">
    {#each { length: count } as _, i}
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2 mb-2">
            <div class="card card-rounded h-100" aria-hidden="true">
                <div class="position-relative ratio ratio-16x9">
                    <svg
                        class="bd-placeholder-img rounded"
                        width="100%"
                        height="180"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Placeholder"
                        preserveAspectRatio="xMidYMid slice"
                        focusable="false"
                    >
                        <title>Placeholder</title>
                        <rect width="100%" height="100%" fill="#868e96" />
                    </svg>
                </div>
                <div class="card-body">
                    <div class="h5 m-0 card-title placeholder-glow">
                        <span class="placeholder col-{getRandomInt(1, 5)}" />
                        <span class="placeholder col-{getRandomInt(3, 5)}" />
                        <span class="placeholder col-{getRandomInt(3, 5)}" />
                    </div>
                    <p class="card-text placeholder-glow">
                        <span class="placeholder col-{getRandomInt(6, 9)}" />
                    </p>
                </div>
            </div>
        </div>
    {:else}
        <div class="col">
            <img src="/img/travoltacheck.gif" alt="travoltacheck" width="110" height="110" />
        </div>
    {/each}
</div>
