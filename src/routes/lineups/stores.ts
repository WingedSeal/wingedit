import { get, writable } from 'svelte/store';

export const FAVOURITE_AGENT_LOCAL_STORAGE = 'favourite-agents';
export const MAIN_AGENT_LOCAL_STORAGE = 'main-agent';

export const getMainAgentID = () => {
	return writable(0);
};

export const updateMainAgentID = (mainAgentID: ReturnType<typeof getMainAgentID>) => {
	mainAgentID.set(Number.parseInt(localStorage.getItem(MAIN_AGENT_LOCAL_STORAGE) || '-1'));
	mainAgentID.subscribe((agent) => {
		console.log(agent);
		localStorage.setItem(MAIN_AGENT_LOCAL_STORAGE, agent.toString());
	});
};

export const getFavouriteAgentIDs = () => {
	const favouriteAgents = writable(new Set<number>());

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

export type FavouriteAgentIDs = ReturnType<typeof getFavouriteAgentIDs>;

export const updateFavouriteAgentIDs = (favouriteAgentIDs: FavouriteAgentIDs) => {
	favouriteAgentIDs.set(
		new Set<number>(JSON.parse(localStorage.getItem(FAVOURITE_AGENT_LOCAL_STORAGE) || '[]'))
	);
	favouriteAgentIDs.subscribe((agents) => {
		localStorage.setItem(FAVOURITE_AGENT_LOCAL_STORAGE, JSON.stringify([...agents]));
	});
};
export const selectedAgent = writable(0);
