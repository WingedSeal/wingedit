import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { Privilege } from '$lib/server/auth';
import { superValidate } from 'sveltekit-superforms';
import { getAgentRoles, getLastAgentID } from '$lib/server/db/valorant';
import { zod } from 'sveltekit-superforms/adapters';
import { mapSchema as schema } from '$lib/schema';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, `/account/signin?redirect=${url.pathname.slice(1)}`);
	if (locals.user.privilege < Privilege.Moderator) throw redirect(303, '/');
	return {
		form: await superValidate(zod(schema)),
		agentRoles: getAgentRoles(),
		lastAgentId: getLastAgentID()
	};
};
