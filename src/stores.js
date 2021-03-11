import { writable } from 'svelte/store';

export let search = writable("");
export let suggestions = writable([]);
