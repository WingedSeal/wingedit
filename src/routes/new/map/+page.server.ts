import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import Privilege from '$lib/privilege';
import { superValidate } from 'sveltekit-superforms';
import { getAgentRoles, getLastAgentID } from '$lib/server/db/valorant';
import { zod } from 'sveltekit-superforms/adapters';
import { mapSchema as schema } from '$lib/schema';

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
	return {
		form: await superValidate(zod(schema)),
		agentRoles: getAgentRoles(),
		lastAgentId: getLastAgentID()
	};
};
