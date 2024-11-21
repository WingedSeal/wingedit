import Privilege from '$lib/privilege';
import { mapSchema as schema } from '$lib/schema';
import { getAgentRoles, getLastAgentID } from '$lib/server/db/valorant';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, `/account/signin?redirect=${url.pathname.slice(1)}`);
	if (locals.user.privilege < Privilege.Moderator) throw redirect(303, '/');
	return {
		form: await superValidate(zod(schema)),
		agentRoles: getAgentRoles(),
		lastAgentId: getLastAgentID()
	};
};
