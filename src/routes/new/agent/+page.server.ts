import { getAgentRoles, getLastAgentID } from '$lib/server/db/query';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		agentRoles: getAgentRoles(),
		lastAgentId: getLastAgentID()
	};
};
