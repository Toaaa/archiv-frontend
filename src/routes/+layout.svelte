<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { theme } from '@stores/main';
    import { bookmarkStore } from '@stores/bookmarks';
    import { page } from '$app/stores';
    import Head from '@components/Head.svelte';
    import Footer from '@components/Footer.svelte';
    import Search from '@components/Search.svelte';

    // vars
    let query = '';
    let preferesDark;
    let bookmarks;
    let hasBookmarkedItems = false;

    $: hasBookmarkedItems =
        $bookmarkStore !== null &&
        ($bookmarkStore.vods.length > 0 || $bookmarkStore.clips.length > 0);

    onMount(async () => {
        // bootstrap js
        await import('bootstrap/js/dist/base-component');
        await import('bootstrap/js/dist/button');
        await import('bootstrap/js/dist/collapse');
        await import('bootstrap/js/dist/dropdown');
        await import('bootstrap/js/dist/modal');
    });

    onMount(() => {
        // delete outdated local storage values
        let watched = JSON.parse(localStorage.getItem('watched'));
        if (watched && watched['vods'] === undefined) {
            localStorage.removeItem('watched');
        }
        if (localStorage.getItem('dark-mode')) {
            localStorage.removeItem('dark-mode');
        }

        // set theme
        preferesDark = window.matchMedia('(prefers-color-scheme: dark)');
        preferesDark.addEventListener('change', (e) => {
            setTheme(e.matches ? 'dark' : 'light');
        });
    });

    // remove search query on page change
    page.subscribe(() => {
        query = '';
    });

    // handle bookmark changes
    bookmarkStore.subscribe((bm) => {
        bookmarks = bm;
        if (browser) localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    });

    // handle new theme
    function setTheme(newTheme) {
        document.documentElement.setAttribute('data-theme', newTheme);
        $theme = newTheme;
        localStorage.setItem('theme', newTheme);
    }
</script>

<Head />

<header>
    <nav class="navbar navbar-expand-lg sticky-top mb-4">
        <div class="container-fluid">
            <a href="/" class="navbar-brand ps-3">
                <img
                    src="/headerLogo.ico"
                    width="50"
                    height="50"
                    class="rounded-circle logo"
                    alt="schneileLogo"
                />
            </a>
            <button
                class="navbar-toggler me-3 rounded-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon" />
            </button>
            <div class="collapse navbar-collapse mx-3" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a
                            class="nav-link dropdown-toggle fs-5"
                            id="navbarVodsDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Vods
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarVodsDropdown">
                            <li><a href="/vods/all" class="dropdown-item">Alle Vods</a></li>
                            <li>
                                <a href="/vods/popular" class="dropdown-item">Meist geschaut</a>
                            </li>
                            <li><a href="/vods/years" class="dropdown-item">Jahresansicht</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fs-5" href="/clips">Clips</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fs-5" href="/stats">Stats</a>
                    </li>
                    {#if hasBookmarkedItems}
                        <li class="nav-item">
                            <a class="nav-link fs-5" href="/bookmarked">
                                Gemerkt
                                {#if hasBookmarkedItems}
                                    <span class="badge rounded-2 px-1 bookmark-count"
                                        >{$bookmarkStore.vods.length +
                                            $bookmarkStore.clips.length}</span
                                    >
                                {/if}
                            </a>
                        </li>
                    {/if}
                </ul>
                <div class="d-flex input-group me-2 search-container" autocomplete="off">
                    <input
                        id="searchInput"
                        class="form-control rounded"
                        type="search"
                        placeholder="Archiv durchsuchen..."
                        aria-label="Suche"
                        name="q"
                        bind:value={query}
                    />
                    {#if query == "Bibel" && $page.url.hostname.startsWith('dev.schneile.tv') || query == "bibel" && $page.url.hostname.startsWith('dev.schneile.tv')}
                        <script>window.location = 'https://cartaux.net/Bibel.html';</script>
                    {/if}
                </div>
                <ul class="navbar-nav me-2">
                    <li class="nav-item dropdown">
                        <a
                            class="nav-link dropdown-toggle fs-5"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            aria-label="Theme"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="currentColor"
                                class="bi bi-palette me-1"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
                                />
                                <path
                                    d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z"
                                />
                            </svg>
                        </a>
                        <ul
                            class="dropdown-menu dropdown-menu-end"
                            aria-labelledby="navbarDropdown"
                        >
                            <li class="cursor-pointer">
                                <div
                                    class="dropdown-item"
                                    on:click={() => setTheme('dark')}
                                    on:keyup={() => setTheme('dark')}
                                >
                                    Dark
                                </div>
                            </li>
                            <li class="cursor-pointer">
                                <div
                                    class="dropdown-item"
                                    on:click={() => setTheme('light')}
                                    on:keyup={() => setTheme('light')}
                                >
                                    Light
                                </div>
                            </li>
                            <li class="cursor-pointer">
                                <div
                                    class="dropdown-item"
                                    on:click={() => setTheme('twitch')}
                                    on:keyup={() => setTheme('twitch')}
                                >
                                    Twitch
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>

{#if query.length == 0}
    <slot />
{:else}
    <Search bind:query />
{/if}

<Footer />

<style lang="scss" global>
    @import '../main.scss';

    .navbar {
        background-color: var(--color-nav-background);
    }

    .navbar-collapse {
        background-color: var(--color-nav-background);
    }

    .nav-link {
        color: var(--color-main) !important;
    }

    .nav-link:hover {
        color: var(--color-custom-hover) !important;
    }

    .dropdown-item {
        &:hover {
            color: var(--color-custom-hover)
        }
    }

    .form-control {
        color: var(--color-main) !important;
        border: var(--border);

        &:focus,
        &:focus-visible {
            color: inherit;
            border-color: inherit;
            box-shadow: none;
        }

        &::placeholder {
            color: var(--color-text-muted);
        }
    }

    .search-container {
        width: 25%;
    }

    #searchResults {
        position: absolute;
        z-index: 1000;
        background-color: var(--color-background);
        border: 1px solid var(--color-main);
        top: 0;
        margin-top: 37px;
        width: 100%;

        h5 {
            margin: 0;
            background-color: var(--color-main);
            color: var(--color-background);
        }
    }

    .navbar-toggler {
        border-radius: var(--border-radius);

        .navbar-toggler-icon {
            background-image: var(--toggler-icon);
        }

        &:focus {
            box-shadow: none !important;
        }
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .bookmark-count {
        background-color: var(--color-main);
        color: var(--color-background);
    }

    @media only screen and (max-width: 991px) {
        .search-container {
            width: 100%;
        }
    }
</style>
