<script>
    import { formatBytes } from '/src/functions';
    import { fetchApi } from '/src/functions';
    import StatsBox from '@components/StatsBox.svelte';
    import ChartBar from '@components/ChartBar.svelte';
    import ChartDoughnut from '@components/ChartDoughnut.svelte';
    import ChartLine from '@components/ChartLine.svelte';
    import SEO from '@components/SEO.svelte';
    import StatsClipper from '@components/StatsClipper.svelte';
    import StatsChatter from '@components/StatsChatter.svelte';
    import MostUsedEmotes from '@components/MostUsedEmotes.svelte';

    let statsDB = {};
    let ogTags = {
        title: 'Statistiken • SchneileTV',
        description: 'Twitch VOD Archiv von Schneile',
        imageurl: '/img/og.png',
        imagealt: 'SchneileTV Archiv OG Image'
    };

    let chat = false;
    let chart = false;
    let transcript = false;
    let ffz = false

</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    <div class="container mb-4">
        <h1 class="display-4 fw-bolder pb-3">Statistiken</h1>
        {#await fetchApi('/stats/long')}
            <div class="text-center mb-3">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Lade...</span>
                </div>
            </div>
        {:then response}
            <section>
                <div class="row">
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Vods"
                            count={response.result.count_vods_total}
                            trend={response.result.trend_vods}
                        />
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Clips"
                            count={response.result.count_clips_total}
                            trend={response.result.trend_clips}
                        />
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Stunden gestreamt"
                            count={Math.round(response.result.count_h_streamed)}
                            trend={Math.round(response.result.trend_h_streamed)}
                        />
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Archivgröße"
                            count={formatBytes(response.result.count_size_bytes)}
                            trend={false}
                        />
                    </div>
                </div>
                <div class="row">
                    {#if transcript}
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Gesprochene Wörter"
                            count={response.result.count_transcript_words}
                            trend={false}
                        />
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Einzigartige Wörter"
                            count={response.result.count_unique_words}
                            trend={false}
                        />
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Durchschnittliche Wörter pro Stream"
                            count={Math.round(response.result.count_avg_words)}
                            trend={false}
                        />
                    </div>
                    {/if}

                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Datenbankgröße"
                            count={formatBytes(response.result.database_size)}
                            trend={false}
                        />
                    </div>
                    {#if chat}
                        <div class="col-12 col-sm-6 col-lg-3 p-2">
                            <StatsBox
                                title="Chat Nachrichten"
                                count={response.result.count_chat_messages}
                                trend={false}
                            />
                        </div>
                    {/if}
                </div>
            </section>
            {#if chart}
                <section>
                    <div class="row">
                        <div class="col-md-8 py-3">
                            <h3 class="display-6 py-3">
                                <strong>Vods pro Monat</strong>
                            </h3>
                            <ChartBar data={response.result.vods_per_month} />
                        </div>
                        <div class="col-md-4 py-3">
                            <h3 class="display-6 py-3">
                                <strong>Vods pro Wochentag</strong>
                            </h3>
                            <ChartDoughnut data={response.result.vods_per_weekday} />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col p-3">
                            <h3 class="display-6 py-3">
                                <strong>Streambeginn nach Uhrzeit</strong>
                            </h3>
                            <ChartLine data={response.result.start_by_time} />
                        </div>
                    </div>
                </section>
            {/if}
            <br><br><br>
            <section>
                <h3 class="display-6 py-3">
                    <strong>Top Users</strong>
                </h3>
                <div class="row gx-5">
                    {#if response.result.messages_per_user.length > 3 && chat}
                        <div class="col-xl-6">
                            <div class="row">
                                <div class="col-md-8 py-3">
                                    <h4 class="h4">
                                        <strong>Chat Nachrichten</strong>
                                    </h4>
                                </div>
                            </div>
                            <div class="row d-flex align-items-end">
                                <div class="col-sm-4 py-3 text-center order-sm-2">
                                    <StatsChatter
                                        chatters={response.result.messages_per_user}
                                        index={0}
                                        color="#c9b037"
                                    />
                                </div>
                                <div class="col-sm-4 py-3 text-center order-sm-1">
                                    <StatsChatter
                                        chatters={response.result.messages_per_user}
                                        index={1}
                                        color="#d7d7d7"
                                    />
                                </div>
                                <div class="col-sm-4 py-3 text-center order-sm-3">
                                    <StatsChatter
                                        chatters={response.result.messages_per_user}
                                        index={2}
                                        color="#ad8a56"
                                    />
                                </div>
                            </div>
                            <div class="row">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Nachrichten</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each response.result.messages_per_user.slice(3) as clipper, i}
                                            <tr>
                                                <th scope="row">{i + 4}</th>
                                                <td>{clipper.name}</td>
                                                <td>{clipper.msg_count.toLocaleString()}</td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    {/if}
                    {#if response.result.clips_per_creator.length > 3}
                        <div class="col-xl-6">
                            <div class="row">
                                <div class="col-md-8 py-3">
                                    <h4 class="h4">
                                        <strong>Beste Clips</strong>
                                    </h4>
                                </div>
                            </div>
                            <div class="row d-flex align-items-end">
                                <div class="col-sm-4 py-3 text-center order-sm-2">
                                    <StatsClipper
                                        clippers={response.result.clips_per_creator}
                                        index={0}
                                        color="#c9b037"
                                    />
                                </div>
                                <div class="col-sm-4 py-3 text-center order-sm-1">
                                    <StatsClipper
                                        clippers={response.result.clips_per_creator}
                                        index={1}
                                        color="#d7d7d7"
                                    />
                                </div>
                                <div class="col-sm-4 py-3 text-center order-sm-3">
                                    <StatsClipper
                                        clippers={response.result.clips_per_creator}
                                        index={2}
                                        color="#ad8a56"
                                    />
                                </div>
                            </div>
                            <div class="row">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Views</th>
                                            <th scope="col">Clips</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each response.result.clips_per_creator.slice(3) as clipper, i}
                                            <tr>
                                                <th scope="row">{i + 4}</th>
                                                <td>{clipper.name}</td>
                                                <td>{clipper.view_count.toLocaleString()}</td>
                                                <td>{clipper.clip_count.toLocaleString()}</td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    {/if}
                </div>
            </section>
        {/await}
        <section>
            <h3 class="display-6 py-3">
                <strong>Emotes</strong>
            </h3>
            {#await fetchApi(`/emotes/?limit=500&provider=twitch`)}
                <h4 class="h4">Twitch</h4>
            {:then emotes}
                <MostUsedEmotes />
                <h4 class="h4">
                    Twitch
                    <small>({emotes.result.length})</small>
                </h4>
                <div class="row">
                    {#each emotes.result as emote}
                        <div class="col-auto p-1">
                            <img
                                src={emote.url}
                                alt={emote.name}
                                loading="lazy"
                                height="60"
                                data-toggle="tooltip"
                                title={emote.name}
                            />
                        </div>
                    {/each}
                </div>
            {/await}
            {#await fetchApi(`/emotes/?limit=500&provider=bttv`)}
                <h4 class="h4 pt-4">BetterTTV</h4>
            {:then emotes}
                <h4 class="h4 pt-4">
                    BetterTTV
                    <small>({emotes.result.length})</small>
                </h4>
                <div class="row">
                    {#each emotes.result as emote}
                        <div class="col-auto p-1">
                            <img
                                src={emote.url}
                                alt={emote.name}
                                loading="lazy"
                                height="60"
                                data-toggle="tooltip"
                                title={emote.name}
                            />
                        </div>
                    {/each}
                </div>
            {/await}
            {#if ffz}
                {#await fetchApi(`/emotes/?limit=500&provider=ffz`)}
                    <h4 class="h4 pt-4">FrankerFaceZ</h4>
                {:then emotes}
                    <h4 class="h4 pt-4">
                        FrankerFaceZ
                        <small>({emotes.result.length})</small>
                    </h4>
                    <div class="row">
                        {#each emotes.result as emote}
                            <div class="col-auto p-1">
                                <img
                                    src={emote.url}
                                    alt={emote.name}
                                    loading="lazy"
                                    height="60"
                                    data-toggle="tooltip"
                                    title={emote.name}
                                />
                            </div>
                        {/each}
                    </div>
                {/await}
            {/if}
        </section>
    </div>
</main>

<style lang="scss">
    .spinner-border {
        color: var(--color-main);
        width: 3rem;
        height: 3rem;
    }
</style>
