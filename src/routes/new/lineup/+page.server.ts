import { IMAGES_PATH } from '$env/static/private';
import { addLineup, getGameInfo, getThrowTypes } from '$lib/server/db/query.js';
import fs from 'fs';
import path from 'path';
import type { PageServerLoad } from './$types';
import { superValidate, fail, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import sizeOf from 'image-size';
import type { Lineup } from '$lib/server/db/types';
import { error, redirect } from '@sveltejs/kit';
import { Privilege } from '$lib/server/auth';
import sharp from 'sharp';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, `/account/signin?redirectTo=${url.pathname.slice(1)}`);
	if (locals.user.privilege < Privilege.Member) throw redirect(303, '/');
	return {
		form: await superValidate(zod(schema)),
		game_info: getGameInfo()
	};
};

const imageZod = z
	.instanceof(File, { message: 'Please upload a file.' })
	.refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.')
	.refine((f) => f.name && f.size != 0, 'Please upload a file.')
	.refine((f) => f.type === 'image/jpeg' || f.type === 'image/png', 'Please upload an image.')
	.refine(async (f) => {
		const size = sizeOf(new Uint8Array(await f.arrayBuffer()));
		return size.width && size.height && size.width * 9 === size.height * 16 && size.width >= 1980;
	}, `Please upload 1980x1080 image.`);

const gifZod = z
	.instanceof(File, { message: 'Please upload a file.' })
	.refine((f) => f.size < 20_000_000, 'Max 20 MB upload size.')
	.refine((f) => f.name && f.size != 0, 'Please upload a file.')
	.refine((f) => f.type === 'image/gif', 'Please upload a GIF.')
	.refine(async (f) => {
		const size = sizeOf(new Uint8Array(await f.arrayBuffer()));
		// return size.width === 1980 && size.height === 1080;
		return size.width && size.height && size.width * 9 === size.height * 16 && size.width >= 1980;
	}, 'Please upload 1980x1080 gif.');

const decimalZod = z
	.number({ message: 'Expected a number.' })
	.positive()
	.max(100)
	.refine((x) => x * 100 - Math.trunc(x * 100) < Number.EPSILON, 'Expected up to 2 decimal points.')
	.default(null as unknown as number);

const schema = z
	.object({
		agent: z.number().int().min(1, 'Please select an agent.'),
		map: z.number().int().min(1, 'Please select a map.'),
		ability: z.number().int().min(1, 'Please select an agent ability.'),
		throwLineup: imageZod,
		throwGif: gifZod,
		landSpot: imageZod,
		throwSpotFirstPerson: imageZod,
		throwSpotThirdPerson: imageZod,
		grade: z.number().int().min(1, 'Please select a grade.'),
		throwType: z.number().int().min(1, 'Please select a throw type.'),
		timeToLand: z
			.number({ message: 'Expected a number.' })
			.positive()
			.max(300)
			.refine(
				(x) => x * 100 - Math.trunc(x * 100) < Number.EPSILON,
				'Expected up to 2 decimal points.'
			)
			.default('' as unknown as number),
		description: z.string().trim(),
		mainX: decimalZod.default(50),
		mainY: decimalZod.default(50),
		sub1X: decimalZod.nullable(),
		sub1Y: decimalZod.nullable(),
		sub2X: decimalZod.nullable(),
		sub2Y: decimalZod.nullable()
	})
	.refine((data) => {
		if ([data.sub1X, data.sub1Y, data.sub2X, data.sub2Y].every((x) => x === null)) {
			return true;
		}
		if ([data.sub1X, data.sub1Y, data.sub2X, data.sub2Y].every((x) => x !== null)) {
			return true;
		}
		return false;
	}, 'sub1X, sub1Y, sub2X, sub2Y must either be all null or all non-null');

const LINEUP_DIRECTORY = 'lineups';

export const actions = {
	upload: async ({ request, locals }) => {
		if (!locals.user) {
			return error(401, 'Invalid or missing session');
		}
		if (locals.user.privilege < Privilege.Moderator) {
			return error(403, 'Not enough privilege');
		}
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const lineup: Lineup = {
			AgentID: form.data.agent,
			AbilityID: form.data.ability,
			MapID: form.data.map,
			ExtraImageCount: -1, // TODO
			ThrowTypeID: getThrowTypes()[form.data.throwType].ID,
			TimeToLand: form.data.timeToLand,
			GradeID: form.data.grade,
			CreatedBy: null, // TODO
			FromMapPositionID: -1, // TODO
			ToMapPositionID: -1, // TODO
			FromX: -1, // TODO
			FromY: -1, // TODO
			ToX: -1, // TODO
			ToY: -1, // TODO
			DrawOverMainX: form.data.mainX,
			DrawOverMainY: form.data.mainY,
			DrawOverSub1X: form.data.sub1X,
			DrawOverSub1Y: form.data.sub1Y,
			DrawOverSub2X: form.data.sub2X,
			DrawOverSub2Y: form.data.sub2Y
		};

		const lineupID = addLineup(lineup).toString();
		fs.mkdirSync(path.join(IMAGES_PATH, LINEUP_DIRECTORY, lineupID), { recursive: true });
		await Promise.all([
			writeJPG(form.data.throwLineup, path.join(LINEUP_DIRECTORY, lineupID, 'throw-lineup.jpg')),
			writeGif(form.data.throwGif, path.join(LINEUP_DIRECTORY, lineupID, 'throw.gif')),
			writeJPG(form.data.landSpot, path.join(LINEUP_DIRECTORY, lineupID, 'land-spot.jpg')),
			writeJPG(
				form.data.throwSpotFirstPerson,
				path.join(LINEUP_DIRECTORY, lineupID, 'throw-spot-first-person.jpg')
			),
			writeJPG(
				form.data.throwSpotThirdPerson,
				path.join(LINEUP_DIRECTORY, lineupID, 'throw-spot-third-person.jpg')
			)
		]);

		return message(form, 'Sucess');
	},
	addMapPosition: async ({ request }) => {
		console.log('WIP');
	}
};

const writeJPG = async (file: File, fileName: string) => {
	const buffer = await file.arrayBuffer();
	sharp(buffer).resize(1980, 1080).jpeg({ mozjpeg: true }).toFile(path.join(IMAGES_PATH, fileName));
};

const writeGif = async (file: File, fileName: string) => {
	const buffer = await file.arrayBuffer();
	sharp(buffer).resize(1980, 1080).gif().toFile(path.join(IMAGES_PATH, fileName));
};
