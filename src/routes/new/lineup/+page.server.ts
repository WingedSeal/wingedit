import { IMAGES_PATH } from '$env/static/private';
import { addLineup, getAgentAbilities, getGameInfo, getThrowTypes } from '$lib/server/db/index.js';
import fs from 'fs';
import path from 'path';
import type { PageServerLoad } from './$types';
import { superValidate, fail, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import sizeOf from 'image-size';
import type { GameInfo, Lineup } from '$lib/server/db/types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(schema)),
		game_info: getGameInfo(),
		agent_abilities: getAgentAbilities()
	};
};

const _image_schema = z
	.instanceof(File, { message: 'Please upload a file.' })
	.refine((f) => f.size < 10_000_000, 'Max 10 MB upload size.')
	.refine((f) => f.name && f.size != 0, 'Please upload a file.')
	.refine((f) => f.type == 'image/jpeg', 'Please upload a jpeg image.')
	.refine(async (f) => {
		const size = sizeOf(new Uint8Array(await f.arrayBuffer()));
		return size.width == 1080 && size.height == 1980;
	}, 'Please upload 1980x1080 image.');

const schema = z.object({
	agent: z.number().min(1, 'Please select an agent.'),
	map: z.number().min(1, 'Please select a map.'),
	ability: z.number().min(1, 'Please select an agent ability.'),
	throwLineup: _image_schema,
	throwGif: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 20_00_000, 'Max 20 MB upload size.')
		.refine((f) => f.name && f.size != 0, 'Please upload a file.')
		.refine((f) => f.type == 'image/gif', 'Please upload a GIF.')
		.refine(async (f) => {
			const size = sizeOf(new Uint8Array(await f.arrayBuffer()));
			return size.width == 1080 && size.height == 1980;
		}, 'Please upload 1980x1080 gif.'),
	landSpot: _image_schema,
	throwSpotFirstPerson: _image_schema,
	throwSpotThirdPerson: _image_schema,
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
			GradeID: form.data.grade
		};

		const uuid = addLineup(lineup);
		write_file(form.data.throwLineup, path.join(uuid, 'throw-lineup.jpg'));
		return message(form, 'Sucess');
	}
};

const write_file = (file: File, file_name: string) => {
	file.arrayBuffer().then((buffer) => {
		fs.writeFile(path.join(IMAGES_PATH, file_name), new Uint8Array(buffer), () => {});
	});
};
