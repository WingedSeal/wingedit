import { getAgents, getGameInfo, getMaps } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { type Agent, type Lineup, type ValorantMap } from '$lib/server/db/types';
import { v4 as uuidv4 } from 'uuid';

export const load = ({ params }) => {
	params.valorant_agent = params.valorant_agent.toLowerCase();
	let agent: Agent | undefined;
	let map: ValorantMap | undefined;
	Object.values(getAgents()).forEach((_agent) => {
		if (_agent.Name.toLowerCase() == params.valorant_agent) {
			agent = _agent;
		}
	});
	Object.values(getMaps()).forEach((_map) => {
		if (_map.Name.toLowerCase() == params.valorant_map) {
			map = _map;
		}
	});
	if (!agent) {
		error(404, `Agent ${params.valorant_agent} not found`);
	}
	if (!map) {
		error(404, `Map ${params.valorant_map} not found`);
	}

	let lineups: Lineup[] = [];
	// temporary place holder
	lineups.push({
		AbilityID: 1,
		AgentID: 1,
		ExtraImageCount: 0,
		GradeID: 1,
		MapID: 2,
		ThrowTypeID: 2,
		TimeToLand: 1,
		UUID: uuidv4()
	});

	const game_info = getGameInfo();
	return {
		valorant: {
			map,
			agent
		},
		lineups,
		game_info
	};
};
