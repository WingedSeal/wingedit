import { writable } from 'svelte/store';

export let isFullScreenImage = writable(false);
export let selectedFullScreenImage = writable(0);
