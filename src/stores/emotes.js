import { readable } from 'svelte/store';
import { fetchApi } from '/src/functions';

const emotes = readable([], (set) => {
    let finalEmotes = [];

    fetchApi('/emotes/?limit=500').then((data) => {
        data.result.forEach((emote) => {
            finalEmotes = [
                ...finalEmotes,
                {
                    name: emote.name,
                    url: emote.url
                }
            ];
            set(finalEmotes);
        });
    });

    fetch('https://api.betterttv.net/3/cached/emotes/global')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((emote) => {
                finalEmotes = [
                    ...finalEmotes,
                    {
                        name: emote.code,
                        url: `https://cdn.betterttv.net/emote/${emote.id}/1x`
                    }
                ];
                set(finalEmotes);
            });
        });

    fetch('https://api.frankerfacez.com/v1/set/global')
        .then((response) => response.json())
        .then((data) => {
            data.sets[data.default_sets[0]].emoticons.forEach((emote) => {
                finalEmotes = [
                    ...finalEmotes,
                    {
                        name: emote.name,
                        url: `https://cdn.frankerfacez.com/emoticon/${emote.id}/1`
                    }
                ];
                set(finalEmotes);
            });
        });
});

async function showEmotesInTitle(title, emotes, size = '1em') {
    let newTitle = title;
    let emoteNames = [];
    let emoteLinks = [];

    Object.keys(emotes).map((key) => {
        if (emoteNames.indexOf(emotes[key].name) === -1) {
            emoteNames.push(emotes[key].name);
            emoteLinks.push(emotes[key].url);
        }
    });

    for (let i = 0; i < emoteNames.length; i++) {
        let value = emoteNames[i];
        let imgHTML = `<img src="${emoteLinks[i]}" alt="${value}" loading="lazy" data-toggle="tooltip" title="${value}" style="height:${size};" />`;
        let re = new RegExp(`\\b${value}\\b`, 'gi');
        newTitle = newTitle.replace(re, imgHTML);
    }

    return newTitle;
}

export { emotes, showEmotesInTitle };
