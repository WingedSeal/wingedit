import { type Agent, type ValorantMap } from '$lib/server/db/types';
import {
	getAgentAbilities,
	getAgents,
	getGameInfo,
	getLineups,
	getMaps
} from '$lib/server/db/valorant';
import { error } from '@sveltejs/kit';

export const load = ({ params }) => {
	params.valorant_agent = params.valorant_agent.toLowerCase();
	let agent: Agent | undefined;
	let map: ValorantMap | undefined;
	Object.values(getAgents()).forEach((_agent) => {
		if (_agent.Name.toLowerCase() === params.valorant_agent) {
			agent = _agent; // TODO: Search with query
		}
	});
	Object.values(getMaps()).forEach((_map) => {
		if (_map.Name.toLowerCase() === params.valorant_map) {
			map = _map; // TODO: Search with query
		}
	});
	if (!agent) {
		error(404, `Agent ${params.valorant_agent} not found`);
	}
	if (!map) {
		error(404, `Map ${params.valorant_map} not found`);
	}
	return {
		valorant: {
			map,
			agent
		},
		lineups: getLineups(agent.ID, map.ID),
		gameInfo: getGameInfo(),
		abilities: getAgentAbilities(agent.ID)
	};
};
