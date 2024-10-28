import { getAgents, getMaps } from '$lib/server/db/valorant';
import type { Agent, ValorantMap } from '$lib/server/db/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		maps: getMaps() as {
			[mapID: number]: ValorantMap;
		},
		agents: getAgents() as {
			[agentID: number]: Agent;
		}
	};
};
