<script>
    export let level;
    export let title;
    export let subtitle;
</script>

<div
    class="alert alert-custom-{level} border-0 rounded-3 fs-4 m-2 mb-5 fw-bold text-center"
    role="alert"
>
    <p class="m-0 fs-2">
        {title}
    </p>
    <p class="m-0">
        {@html subtitle}
    </p>
</div>

<style lang="scss">
    :global(a) {
        color: inherit;
    }
    .alert-custom-success {
        background-color: var(--color-nav-background);
        color: var(--color-alert-success);
        box-shadow: 7px 5px 0px var(--color-alert-success);

        :global(.alert-link) {
            color: var(--color-alert-success);
        }
    }
    .alert-custom-danger {
        background-color: var(--color-nav-background);
        color: var(--color-alert-danger);
        box-shadow: 7px 5px 0px var(--color-alert-danger);

        :global(.alert-link) {
            color: var(--color-alert-danger);
        }
    }

    .alert-custom-attention {
        background-color: var(--color-nav-background);
        color: var(--color-alert-attention);
        box-shadow: 7px 5px 0px var(--color-alert-attention);

        :global(.alert-link) {
            color: var(--color-alert-attention);
        }
    }

    .alert-custom-beta {
        background-color: var(--color-nav-background);
        color: var(--color-alert-beta);
        box-shadow: 7px 5px 0px var(--color-alert-beta);

        :global(.alert-link) {
            color: var(--color-alert-beta);
        }
    }

    @media only screen and (min-width: 768px) {
        .alert-custom-success {
            background-image: url('/img/spinning.gif'), url('/img/spinning.gif');
            background-position: left, right;
            background-size: contain;
            background-repeat: no-repeat;
        }
        .alert-custom-danger {
            // background-image: url('/img/placeholder.png'), url('/img/placeholder.png');
            background-position: left, right;
            background-size: contain;
            background-repeat: no-repeat;
        }
    }
</style>
