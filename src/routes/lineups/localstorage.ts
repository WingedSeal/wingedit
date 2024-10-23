import { browser } from '$app/environment';
import { readable, writable } from 'svelte/store';

const FAVOURITE_AGENT = 'favourite-agents';
const MAIN_AGENT = 'main-agent';

export const serverMainAgent = () => {
	return readable(0);
};

export const clientMainAgent = () => {
	const mainAgent = writable(0);
	mainAgent.subscribe((agent) => {
		localStorage.setItem(MAIN_AGENT, agent.toString());
	});
	mainAgent.set(Number.parseInt(localStorage.getItem(MAIN_AGENT) || '-1'));
	return mainAgent;
};

export const serverFavouriteAgents = () => {
	return readable(new Set<number>());
};

export const clientFavouriteAgents = () => {
	const favouriteAgents = writable(new Set<number>());
	favouriteAgents.subscribe((agents) => {
		localStorage.setItem(FAVOURITE_AGENT, JSON.stringify([...agents]));
	});
	favouriteAgents.set(new Set(JSON.parse(localStorage.getItem(FAVOURITE_AGENT) || '[]')));
	return favouriteAgents;
};
