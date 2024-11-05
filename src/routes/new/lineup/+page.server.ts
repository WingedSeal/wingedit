import { IMAGES_PATH, VALIDATE_IMAGE_SIZE } from '$env/static/private';
import {
	addLineup,
	getAbilities,
	getGameInfo,
	getMaps,
	getThrowTypes
} from '$lib/server/db/valorant';
import fs from 'fs';
import path from 'path';
import type { PageServerLoad } from './$types';
import { superValidate, fail, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Lineup, MapPosition } from '$lib/server/db/types';
import { error, redirect } from '@sveltejs/kit';
import Privilege from '$lib/privilege';
import { getLineupSchema } from '$lib/schema';
import sharp from 'sharp';
import { fail as svelteFail } from '@sveltejs/kit';
import { isMapPositionExist } from '$lib/server/db/valorant/get';
import { addMapPosition } from '$lib/server/db/valorant/post';

const schema =
	VALIDATE_IMAGE_SIZE === 'true'
		? getLineupSchema(
				async (f) => {
					const size = await sharp(await f.arrayBuffer()).metadata();
					return (size.width &&
						size.height &&
						size.width * 9 === size.height * 16 &&
						size.width >= 1920) as boolean;
				},
				'Please upload 1920x1080 image.',
				async (f) => {
					const size = await sharp(await f.arrayBuffer()).metadata();
					return (size.width &&
						size.height &&
						size.width * 9 === size.height * 16 &&
						size.width >= 1920) as boolean;
				},
				'Please upload 1920x1080 gif.'
			)
		: getLineupSchema(null, '', null, '');

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, `/account/signin?redirect=${url.pathname.slice(1)}`);
	if (locals.user.privilege < Privilege.Member) throw redirect(303, '/');
	return {
		form: await superValidate(zod(schema)),
		gameInfo: getGameInfo(),
		abilities: getAbilities()
	};
};

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
			ExtraImageCount: form.data.extraImages.length,
			ThrowTypeID: form.data.throwType,
			TimeToLand: form.data.timeToLand,
			GradeID: form.data.grade,
			Difficulty: form.data.difficulty,
			SideID: form.data.side,
			CreatedBy: locals.user.id,
			FromMapPositionID: form.data.from,
			ToMapPositionID: form.data.to,
			FromX: form.data.fromX,
			FromY: form.data.fromY,
			ToX: form.data.toX,
			ToY: form.data.toY,
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
			writeWebp(form.data.throwLineup, path.join(LINEUP_DIRECTORY, lineupID, 'throw-lineup.webp')),
			writeWebpAnimated(form.data.throwGif, path.join(LINEUP_DIRECTORY, lineupID, 'throw.webp')),
			writeWebp(form.data.landSpot, path.join(LINEUP_DIRECTORY, lineupID, 'land-spot.webp')),
			writeWebp(
				form.data.throwSpotFirstPerson,
				path.join(LINEUP_DIRECTORY, lineupID, 'throw-spot-first-person.webp')
			),
			writeWebp(
				form.data.throwSpotThirdPerson,
				path.join(LINEUP_DIRECTORY, lineupID, 'throw-spot-third-person.webp')
			),
			...form.data.extraImages.map((extraImage, i) =>
				writeExtraImages(extraImage, path.join(LINEUP_DIRECTORY, lineupID, `${i + 1}.webp`))
			)
		]);

		return message(form, 'Sucess');
	},
	addMapPosition: async ({ request }) => {
		const data = await request.formData();
		const callout = data.get('callout') as string;
		const mapID = data.get('map') as unknown as number;
		if (!mapID) return svelteFail(400, { error: true, message: `No map was chosen.` });
		if (isMapPositionExist(callout, mapID))
			return svelteFail(400, {
				error: true,
				message: `Callout '${callout}' already exists in map '${getMaps()[mapID]}'`
			});
		const { success, newID } = addMapPosition(callout, mapID);
		if (!success) {
			return svelteFail(400, {
				error: true,
				message: `Fail to add map position '${callout}'.`
			});
		}
		const newPosition: MapPosition = {
			ID: newID,
			Callout: callout,
			MapID: mapID
		};
		return { success: true, message: 'Callout was added successfully.', newPosition };
	}
};

const writeWebp = async (file: File | null, fileName: string) => {
	if (file === null) return;
	const buffer = await file.arrayBuffer();
	sharp(buffer)
		.resize(1980, 1080)
		.webp({ minSize: true, effort: 6 })
		.toFile(path.join(IMAGES_PATH, fileName));
};

const writeExtraImages = async (file: File | null, fileName: string) => {
	if (file === null) return;
	const buffer = await file.arrayBuffer();
	sharp(buffer).webp({ minSize: true, effort: 6 }).toFile(path.join(IMAGES_PATH, fileName));
};

const writeWebpAnimated = async (file: File | null, fileName: string) => {
	if (file === null) return;
	const buffer = await file.arrayBuffer();
	sharp(buffer, { animated: true })
		.resize(1980, 1080)
		.webp({ minSize: true, effort: 6 })
		.toFile(path.join(IMAGES_PATH, fileName));
};
