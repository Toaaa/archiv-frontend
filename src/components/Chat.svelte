<script>
    import { onMount } from 'svelte';
    import { parseISO, getUnixTime } from 'date-fns';
    import { fetchApi, toHHMMSS } from '/src/functions';
    import { fade } from 'svelte/transition';
    import { emotes, showEmotesInTitle } from '@stores/emotes';

    export let vod;
    export let playerTime;
    export let showChat;

    const startUnix = getUnixTime(parseISO(vod.date));
    const endUnix = getUnixTime(parseISO(vod.date)) + vod.duration;

    let fetchedMessages = [];
    let showingMessages = [];
    let badges = {};
    let chatbox;
    let scrolled = false;

    String.prototype.unescapeEntities = function () {
        return this.replace(/&#([0-9]{1,4});/gi, function (match, numStr) {
            let num = parseInt(numStr, 10);
            return String.fromCharCode(num);
        });
    };

    onMount(async () => {
        // fetch chat messages
        const msgResp = await fetchApi(`/chat/?from=${startUnix}&to=${endUnix}`);
        fetchedMessages = msgResp.result;

        // replace emotes in message
        Object.keys(fetchedMessages).map((key) => {
            replaceEmotes(fetchedMessages[key]).then((title) => {
                fetchedMessages[key].message = title;
            });
        });

        // fetch twitch global badges
        fetch('https://badges.twitch.tv/v1/badges/global/display')
            .then((res) => res.json())
            .then((data) => (badges.global = data.badge_sets));

        // fetch twitch channel badges
        fetch(`https://badges.twitch.tv/v1/badges/channels/${msgResp.broadcaster_id}/display`)
            .then((res) => res.json())
            .then((data) => (badges.subscriber = data.badge_sets.subscriber.versions));
    });

    $: if (fetchedMessages.length > 0) {
        // update shown messages
        Object.keys(fetchedMessages).map((key) => {
            if (startUnix + playerTime >= getUnixTime(parseISO(fetchedMessages[key].created_at))) {
                if (showingMessages.indexOf(fetchedMessages[key]) === -1) {
                    showingMessages = [...showingMessages, fetchedMessages[key]].slice(-300);
                }
            }
        });
        if (showingMessages.length > 0 && !scrolled) {
            scrollChatDown();
        }
        setScrolled();
    }

    // scroll to bottom if user hasn't scrolled up
    function scrollChatDown() {
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    // set user scrolled status
    function setScrolled() {
        if (chatbox.scrollTop + 200 <= chatbox.scrollHeight - chatbox.clientHeight) {
            scrolled = true;
        } else {
            scrolled = false;
        }
    }

    async function replaceEmotes(message) {
        let decodedmsg;
        try {
            decodedmsg = decodeURIComponent(message.message);
        } catch {
            decodedmsg = message.message;
        }
        decodedmsg = decodedmsg.unescapeEntities();
        let finalmsg = `${decodedmsg}`;
        if (message.tags.emotes !== '') {
            message.tags.emotes.split('/').forEach((emote) => {
                const emote_id = emote.split(':')[0];
                const emote_positions = emote.split(':')[1].split(',');
                const start = parseInt(emote_positions[0].split('-')[0]);
                const end = parseInt(emote_positions[0].split('-')[1]);
                const emote_str = decodedmsg.substring(start, end + 1);
                // this hopefully works
                // alternative would be splitting all emotes with positions, save them in an object,
                // reverse sort that object by positions and loop through it and replace strings.
                // soooo.... replaceAll is faster
                finalmsg = finalmsg.replaceAll(
                    emote_str,
                    `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${emote_id}/default/light/1.0" />`
                );
            });
        }
        const replace3rdPartyEmotes = await showEmotesInTitle(finalmsg, $emotes, '1.5em');
        return replace3rdPartyEmotes;
    }
</script>

<div
    class="chatbox-container w-100 px-2 rounded position-absolute overflow-auto h-100"
    bind:this={chatbox}
    on:scroll={() => setScrolled()}
>
    {#if fetchedMessages.length === 0}
        <p class="text-center fw-bold my-2">Das Chat-Feature ist noch in Arbeit.</p>
        <p class="text-center fw-bold my-2">Falls du diese Nachricht siehst, bedeutet das, dass keine Chatnachrichten gefunden wurden.</p>
        <!-- <p class="text-center fw-bold my-2">Mehr Informationen dazu findest du <a href='https://www.twitch.tv/schneiletv' target="_blank" rel="noopener noreferrer">hier</a></p> -->
        <br>
        <p class="text-center">
            <button
                class="btn btn-sm cursor-pointer"
                on:click={() => (showChat = false)}
                on:keypress={() => (showChat = false)}
            >
                Fenter ausblenden
            </button>
        </p>
    {:else}
        <p class="text-muted text-center my-2">Nachrichten wurden geladen</p>
        {#each showingMessages as message}
            <p
                class="chatmessage mb-2 text-break {message.tags['first-msg'] === '1'
                    ? 'firstmessage rounded p-2'
                    : 'p-0'}"
            >
                {#if message.tags['first-msg'] === '1'}
                    <small class="text-muted">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-stars"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"
                            />
                        </svg>
                        Erste Nachricht<br />
                    </small>
                {/if}
                {#if message.tags['reply-parent-msg-body'] && message.tags['reply-parent-msg-body'] !== ''}
                    <small class="text-muted"
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-reply-fill"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M5.921 11.9 1.353 8.62a.719.719 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z"
                            />
                        </svg>
                        {message.tags['reply-parent-display-name']}: {message.tags[
                            'reply-parent-msg-body'
                        ]}</small
                    ><br />
                {/if}
                <small class="text-muted"
                    >{toHHMMSS(
                        getUnixTime(parseISO(message.created_at)) - startUnix,
                        'HH:mm:ss'
                    )}</small
                >
                {#if badges?.global && badges?.subscriber}
                    {#each message.tags.badges.split(',') as badge}
                        {#if badge.split('/')[0] === 'subscriber'}
                            <img
                                class="ms-1"
                                src={badges?.subscriber?.[badge.split('/')[1]]?.image_url_1x}
                                alt={badges?.subscriber?.[badge.split('/')[1]]?.title}
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={badges?.subscriber?.[badge.split('/')[1]]?.title}
                            />
                        {:else}
                            <img
                                class="ms-1"
                                src={badges?.global?.[badge.split('/')[0]]?.versions[
                                    badge.split('/')[1]
                                ]?.image_url_1x}
                                alt={badges?.global?.[badge.split('/')[0]]?.versions[
                                    badge.split('/')[1]
                                ]?.title}
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title={badges?.global?.[badge.split('/')[0]]?.versions[
                                    badge.split('/')[1]
                                ]?.title}
                            />
                        {/if}
                    {/each}
                {/if}
                <span style="color: {message.tags.color ? message.tags.color : '#2f3c84'};"
                    >{message.user_display_name}</span
                >:
                {@html message.message}
            </p>
        {/each}
    {/if}
    {#if scrolled}
        <div class="scroll-to-bottom position-sticky text-center">
            <span
                class="scroll-to-bottom-text cursor-pointer rounded p-2"
                on:click={() => scrollChatDown()}
                on:keyup={() => scrollChatDown()}
                transition:fade={{ duration: 100 }}
            >
                Nach unten scrollen
            </span>
        </div>
    {/if}
</div>

<style lang="scss">
    .chatbox-container {
        border: 2px solid var(--color-hover);
    }

    .chatmessage {
        &:hover {
            background-color: var(--color-hover);
        }
    }

    :global(.firstmessage) {
        border: 1px solid var(--color-matched-string);
        background-color: var(--color-hover);
    }

    .scroll-to-bottom {
        bottom: 1rem;
    }

    .scroll-to-bottom-text {
        color: var(--color-background);
        background: var(--color-main);
        box-shadow: 0 0 20px 8px var(--color-background);
    }
</style>
