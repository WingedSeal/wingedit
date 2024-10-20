import { addAbility, addAgent, getAgentRoles, getLastAgentID } from '$lib/server/db/query';
import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from '@sveltejs/kit';
import type { Ability, Agent } from '$lib/server/db/types';

export const load: PageServerLoad = async () => {
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
	upload: async ({ request }) => {
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
