import { IMAGES_PATH, VALIDATE_IMAGE_SIZE } from '$env/static/private';
import Privilege from '$lib/privilege';
import { getAgentSchema } from '$lib/schema';
import type { Ability, Agent } from '$lib/server/db/types';
import { addAgentAndAbilities, getAgentRoles, getLastAgentID } from '$lib/server/db/valorant';
import {
	ABILITY_ICON_SIZE,
	AGENT_ICON_SIZE,
	writeWebp,
	writeWebpNoResize
} from '$lib/server/file-system';
import { error, redirect, type Actions } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fail, setError, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

const AGENT_DIRECTORY = 'agents';
const ABILITY_DIRECTORY = 'abilities';

const schema =
	VALIDATE_IMAGE_SIZE === 'true'
		? getAgentSchema({
				refineAgentImage: async (f) => {
					const size = await sharp(await f.arrayBuffer()).metadata();
					return (size.width &&
						size.height &&
						size.width === size.height &&
						size.width >= AGENT_ICON_SIZE[0]) as boolean;
				},
				refineAgentImageError: 'Please upload 1000x1000 image.',
				refineAbilityImage: async (f) => {
					const size = await sharp(await f.arrayBuffer()).metadata();
					return (size.width &&
						size.height &&
						size.width === size.height &&
						size.width >= ABILITY_ICON_SIZE[0]) as boolean;
				},
				refineAbilityImageError: 'Please upload 128x128 image.'
			})
		: getAgentSchema();

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, `/account/signin?redirect=${url.pathname.slice(1)}`);
	if (locals.user.privilege < Privilege.Moderator) throw redirect(303, '/');
	let form = await superValidate<Infer<typeof schema>, { newID: number }>(zod(schema));
	form.data.agentID = getLastAgentID() + 1;
	return {
		form,
		agentRoles: getAgentRoles()
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
		const abilities: Ability[] = form.data.abilities.map((ability, i) => {
			return {
				AbilityID: i + 1,
				AgentID: agent.ID,
				Name: ability.abilityName
			};
		});
		const _error = addAgentAndAbilities(agent, abilities);
		if (_error) {
			const { errorPath, errorMessage } = _error;
			return setError(form, errorPath, errorMessage);
		}

		const agentID = agent.ID.toString();
		fs.mkdirSync(path.join(IMAGES_PATH, AGENT_DIRECTORY, agentID, ABILITY_DIRECTORY), {
			recursive: true
		});
		await Promise.all([
			writeWebp(
				form.data.agentIcon,
				path.join(AGENT_DIRECTORY, agentID, 'icon.webp'),
				AGENT_ICON_SIZE
			),
			writeWebpNoResize(form.data.agentImage, path.join(AGENT_DIRECTORY, agentID, 'full.webp')),
			...form.data.abilities.map((ability, i) =>
				writeWebp(
					ability.abilityIcon,
					path.join(AGENT_DIRECTORY, agentID, ABILITY_DIRECTORY, `${i + 1}.webp`),
					ABILITY_ICON_SIZE
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
