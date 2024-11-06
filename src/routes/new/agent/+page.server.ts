import { addAbility, addAgent, getAgentRoles, getLastAgentID } from '$lib/server/db/valorant';
import type { PageServerLoad } from './$types';
import { fail, message, setError, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { Agent } from '$lib/server/db/types';
import Privilege from '$lib/privilege';
import { agentSchema as schema } from '$lib/schema';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, `/account/signin?redirect=${url.pathname.slice(1)}`);
	if (locals.user.privilege < Privilege.Moderator) throw redirect(303, '/');
	return {
		form: await superValidate<Infer<typeof schema>, { newID: number }>(zod(schema)),
		agentRoles: getAgentRoles(),
		lastAgentId: getLastAgentID()
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
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
				Name: ability.abilityName
			};
		});

		if (!addAgent(agent)) {
			return setError(form, 'agentID', 'Fail to add agent. (AgentID possibly already exists.)');
		}
		abilities.forEach((ability, i) => {
			if (!addAbility(ability)) {
				return setError(
					form,
					`abilities[${i}].abilityName`,
					`Fail to add ability: ${ability.Name}.`
				);
			}
		});
		form.data = {
			...(await superValidate(zod(schema))).data,
			agentID: agent.ID + 1
		};
		return { form };
	}
};
