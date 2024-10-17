import { IMAGES_PATH } from '$env/static/private';
import { addLineup, getAgentAbilities, getGameInfo, getThrowTypes } from '$lib/server/db/index.js';
import fs from 'fs';
import path from 'path';
import type { PageServerLoad } from './$types';
import { superValidate, fail, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import sizeOf from 'image-size';
import type { Lineup } from '$lib/server/db/types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(schema)),
		game_info: getGameInfo(),
		agent_abilities: getAgentAbilities()
	};
};

const imageZod = z
	.instanceof(File, { message: 'Please upload a file.' })
	.refine((f) => f.size < 10_000_000, 'Max 10 MB upload size.')
	.refine((f) => f.name && f.size != 0, 'Please upload a file.')
	.refine((f) => f.type == 'image/jpeg', 'Please upload a jpeg image.')
	.refine(async (f) => {
		const size = sizeOf(new Uint8Array(await f.arrayBuffer()));
		return size.width == 1080 && size.height == 1980;
	}, 'Please upload 1980x1080 image.');

const gifZod = z
	.instanceof(File, { message: 'Please upload a file.' })
	.refine((f) => f.size < 20_00_000, 'Max 20 MB upload size.')
	.refine((f) => f.name && f.size != 0, 'Please upload a file.')
	.refine((f) => f.type == 'image/gif', 'Please upload a GIF.')
	.refine(async (f) => {
		const size = sizeOf(new Uint8Array(await f.arrayBuffer()));
		return size.width == 1080 && size.height == 1980;
	}, 'Please upload 1980x1080 gif.');

const schema = z.object({
	agent: z.number().min(1, 'Please select an agent.'),
	map: z.number().min(1, 'Please select a map.'),
	ability: z.number().min(1, 'Please select an agent ability.'),
	throwLineup: imageZod,
	throwGif: gifZod,
	landSpot: imageZod,
	throwSpotFirstPerson: imageZod,
	throwSpotThirdPerson: imageZod,
	grade: z.number().min(1, 'Please select a grade.'),
	throwType: z.number().min(1, 'Please select a throw type.'),
	timeToLand: z
		.number({ message: 'Expected a number.' })
		.positive()
		.max(300)
		.refine(
			(x) => x * 100 - Math.trunc(x * 100) < Number.EPSILON,
			'Expected up to 2 decimal points.'
		)
		.default('' as unknown as number),
	description: z.string()
});

const LINEUP_DIRECTORY = 'lineups';

export const actions = {
	upload: async ({ request }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const lineup: Lineup = {
			AbilityID: form.data.ability,
			AgentID: form.data.agent,
			MapID: form.data.map,
			ExtraImageCount: -1, // TODO
			ThrowTypeID: getThrowTypes()[form.data.throwType].ID,
			TimeToLand: form.data.timeToLand,
			GradeID: form.data.grade,
			DrawOverMainX: -1, // TODO
			DrawOverMainY: -1 // TODO
		};

		const lineupID = addLineup(lineup).toString();
		writeFile(form.data.throwLineup, path.join(LINEUP_DIRECTORY, lineupID, 'throw-lineup.jpg'));
		writeFile(form.data.throwGif, path.join(LINEUP_DIRECTORY, lineupID, 'throw.gif'));
		writeFile(form.data.landSpot, path.join(LINEUP_DIRECTORY, lineupID, 'land-spot.jpg'));
		writeFile(
			form.data.throwSpotFirstPerson,
			path.join(LINEUP_DIRECTORY, lineupID, 'throw-spot-first-person.jpg')
		);
		writeFile(
			form.data.throwSpotThirdPerson,
			path.join(LINEUP_DIRECTORY, lineupID, 'throw-spot-third-person.jpg')
		);

		return message(form, 'Sucess');
	}
};

const writeFile = (file: File, fileName: string) => {
	file.arrayBuffer().then((buffer) => {
		fs.writeFile(path.join(IMAGES_PATH, fileName), new Uint8Array(buffer), () => {});
	});
};
