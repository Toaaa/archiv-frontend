import { writable } from 'svelte/store';

export const clipFilter = writable({
    sort_by: 'date',
    direction: 'desc',
    date_from: null,
    date_to: null
});

export const theme = writable();
export const db = writable();
export const theaterMode = writable(false);
if (typeof window !== 'undefined') [theme.set(localStorage.getItem('theme'))];
