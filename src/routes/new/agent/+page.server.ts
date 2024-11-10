import { addAbility, addAgent, getAgentRoles, getLastAgentID } from '$lib/server/db/valorant';
import type { PageServerLoad } from './$types';
import { fail, setError, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { Agent } from '$lib/server/db/types';
import Privilege from '$lib/privilege';
import { getAgentSchema } from '$lib/schema';
import { IMAGES_PATH, VALIDATE_IMAGE_SIZE } from '$env/static/private';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { SQUARE, writeWebp, writeWebpNoResize } from '$lib/server/file-system';

const AGENT_DIRECTORY = 'agents';
const ABILITY_DIRECTORY = 'abilities';

const schema =
	VALIDATE_IMAGE_SIZE === 'true'
		? getAgentSchema({
				refineImage: async (f) => {
					const size = await sharp(await f.arrayBuffer()).metadata();
					return (size.width &&
						size.height &&
						size.width === size.height &&
						size.width >= 512) as boolean;
				},
				refineImageError: 'Please upload 512x512 image.'
			})
		: getAgentSchema();

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

		const agentID = agent.ID.toString();
		fs.mkdirSync(path.join(IMAGES_PATH, AGENT_DIRECTORY, agentID, ABILITY_DIRECTORY), {
			recursive: true
		});
		await Promise.all([
			writeWebp(form.data.agentIcon, path.join(AGENT_DIRECTORY, agentID, 'icon.webp'), SQUARE),
			writeWebpNoResize(form.data.agentImage, path.join(AGENT_DIRECTORY, agentID, 'full.webp')),
			...form.data.abilities.map((ability, i) =>
				writeWebp(
					ability.abilityIcon,
					path.join(AGENT_DIRECTORY, agentID, ABILITY_DIRECTORY, `${i + 1}.webp`),
					SQUARE
				)
			)
		]);

		form.data = {
			...(await superValidate(zod(schema))).data,
			agentID: agent.ID + 1
		};
		return { form };
	}
};
