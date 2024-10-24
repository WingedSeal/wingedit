import { browser } from '$app/environment';
import { get, readable, writable } from 'svelte/store';

const FAVOURITE_AGENT = 'favourite-agents';
const MAIN_AGENT = 'main-agent';

export const serverMainAgent = () => {
	return readable(0);
};

export const clientMainAgent = () => {
	const mainAgent = writable(Number.parseInt(localStorage.getItem(MAIN_AGENT) || '-1'));
	mainAgent.subscribe((agent) => {
		localStorage.setItem(MAIN_AGENT, agent.toString());
	});
	return mainAgent;
};

export const serverFavouriteAgents = () => {
	return { ...readable(new Set<number>()), add: (_: number) => {}, delete: (_: number) => {} };
};

export const clientFavouriteAgents = () => {
	const favouriteAgents = writable(
		new Set<number>(JSON.parse(localStorage.getItem(FAVOURITE_AGENT) || '[]'))
	);
	favouriteAgents.subscribe((agents) => {
		localStorage.setItem(FAVOURITE_AGENT, JSON.stringify([...agents]));
	});
	return {
		...favouriteAgents,
		add: (value: number) => {
			favouriteAgents.set(get(favouriteAgents).add(value));
		},
		delete: (value: number) => {
			let agents = get(favouriteAgents);
			agents.delete(value);
			favouriteAgents.set(agents);
		}
	};
};
