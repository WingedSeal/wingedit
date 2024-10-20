import { addAbility, addAgent, getAgentRoles, getLastAgentID } from '$lib/server/db/query';
import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { Ability, Agent } from '$lib/server/db/types';
import { Privilege } from '$lib/server/auth';

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
	agentID: z.number().int(),
	agentName: z.string().min(1).max(16),
	agentRole: z.number().int().min(1).max(4),
	abilities: z
		.object({
			abilityName: z.string().min(1).max(16),
			abilityNameID: z.string().min(1).max(16)
		})
		.array()
});

export const actions: Actions = {
	upload: async ({ request, locals }) => {
		if (!locals.user) {
			return error(401, 'Invalid or missing session');
		}
		if (locals.user.privilege < Privilege.Moderator) {
			return error(403, 'Not enough privilege');
		}
		let form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const agent: Agent = {
			ID: form.data.agentID,
			Name: form.data.agentName,
			RoleID: form.data.agentRole
		};

		const abilities = form.data.abilities.map((ability, i) => {
			return {
				AbilityID: i + 1,
				AgentID: agent.ID,
				Name: ability.abilityName,
				NameID: ability.abilityNameID
			};
		});

		if (!addAgent(agent)) {
			form.message = 'Fail to add agent. (AgentID possibly already exists.)';
			return fail(400, { form });
		}
		abilities.forEach((ability) => {
			if (!addAbility(ability)) {
				form.message = `Fail to add ability: ${ability.Name}.`;
				return fail(400, { form });
			}
		});

		return message(form, 'Sucess');
	}
};
