<script>
    import { getRandomInt } from '/src/functions';

    export let count;
</script>

{#each { length: count } as _, i}
    <div class="card mb-3">
        <div class="row g-3">
            <div class="col-md-3">
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
            </div>
            <div class="col-md-9">
                <div class="card-body">
                    <h5 class="card-title">
                        <span class="placeholder col-{getRandomInt(1, 5)}" />
                        <span class="placeholder col-{getRandomInt(6, 10)}" />
                        <span class="placeholder col-{getRandomInt(1, 7)}" />
                        <span class="placeholder col-{getRandomInt(4, 6)}" />
                    </h5>
                    <p class="card-text">
                        <span class="placeholder col-{getRandomInt(1, 5)}" />
                        <span class="placeholder col-{getRandomInt(3, 7)}" />
                        <span class="placeholder col-{getRandomInt(1, 3)}" />
                    </p>
                    <p class="card-text">
                        <span class="placeholder col-{getRandomInt(2, 5)}" />
                    </p>
                </div>
            </div>
        </div>
    </div>
{/each}
