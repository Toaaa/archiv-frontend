<script>
    export let title;
    export let count;
    export let trend;

    count = count.toLocaleString();
</script>

<div class="stats-box rounded-3 text-center p-3">
    <div class="row d-flex align-items-center justify-content-center h-100">
        <div class="col-auto mx-3">
            <strong class="fs-1">{count}</strong>
        </div>
        {#if trend !== false}
            <div class="col-auto mx-3">
                <div class="fs-3 fw-bold">
                    {#if trend > 0}
                        <div
                            class="m-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="im Vergleich zum vorherigen Monat"
                        >
                            +{trend}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="currentColor"
                                class="bi bi-arrow-up-right-square-fill"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12zM5.904 10.803 10 6.707v2.768a.5.5 0 0 0 1 0V5.5a.5.5 0 0 0-.5-.5H6.525a.5.5 0 1 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 .707.707z"
                                />
                            </svg>
                        </div>
                    {:else if trend == 0}
                        <div
                            class="m-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="im Vergleich zum vorherigen Monat"
                        >
                            +{trend}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="currentColor"
                                class="bi bi-arrow-right-square-fill"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1z"
                                />
                            </svg>
                        </div>
                    {:else}
                        <div
                            class="m-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="im Vergleich zum vorherigen Monat"
                        >
                            {trend}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="currentColor"
                                class="bi bi-arrow-down-right-square-fill"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M14 16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12zM5.904 5.197 10 9.293V6.525a.5.5 0 0 1 1 0V10.5a.5.5 0 0 1-.5.5H6.525a.5.5 0 0 1 0-1h2.768L5.197 5.904a.5.5 0 0 1 .707-.707z"
                                />
                            </svg>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
        <div class="fs-5">{title}</div>
    </div>
</div>

<style lang="scss">
    .stats-box {
        color: var(--color-main);
        background-color: var(--color-hover);
        height: 100%;
        box-shadow: var(--drop-shadow);
        -webkit-box-shadow: var(--drop-shadow);
        -moz-box-shadow: var(--drop-shadow);
    }
</style>
