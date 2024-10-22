import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { Privilege } from '$lib/server/auth';
import { superValidate } from 'sveltekit-superforms';
import { getAgentRoles, getLastAgentID } from '$lib/server/db/query';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, `/account/signin?redirectTo=${url.pathname.slice(1)}`);
	if (locals.user.privilege < Privilege.Moderator) throw redirect(303, '/');
	return {
		form: await superValidate(zod(schema)),
		agentRoles: getAgentRoles(),
		lastAgentId: getLastAgentID()
	};
};

const schema = z.object({
	mapID: z.number().int(),
	mapName: z.string().min(1).max(16).trim()
});
