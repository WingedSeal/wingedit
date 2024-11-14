import { IMAGES_PATH } from '$env/static/private';
import { addLineup, getAbilities, getGameInfo } from '$lib/server/db/valorant';
import fs from 'fs';
import path from 'path';
import type { PageServerLoad } from './$types';
import { superValidate, fail, message, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Lineup, MapPosition } from '$lib/server/db/types';
import { error, redirect } from '@sveltejs/kit';
import Privilege from '$lib/privilege';
import { mapPositionSchema } from '$lib/schema';
import { mapPositionDeleteSchema } from '$lib/hidden-schema';
import { FULL_HD, writeWebpNoResize, writeWebp, writeWebpAnimated } from '$lib/server/file-system';
import {
	LINEUP_DIRECTORY,
	lineupActions,
	lineupSchema,
	type DataType
} from '$lib/server/forms/lineup';

export const load = (async ({ parent }) => {
	await parent();
	const data: DataType = {
		lineupForm: await superValidate<Infer<typeof lineupSchema>, string>(zod(lineupSchema)),
		mapPositionForm: await superValidate<
			Infer<typeof mapPositionSchema>,
			{ message: string; newMapPosition: MapPosition; mapID: number }
		>(zod(mapPositionSchema)),
		mapPositionDeleteForm: await superValidate<
			Infer<typeof mapPositionDeleteSchema>,
			{ message: string; deletedMapPosition: MapPosition }
		>(zod(mapPositionDeleteSchema)),
		gameInfo: getGameInfo(),
		abilities: getAbilities()
	};
	return data;
}) satisfies PageServerLoad;

export const actions = {
	...lineupActions,
	addLineup: async ({ request, locals }) => {
		if (!locals.user) {
			return error(401, 'Invalid or missing session');
		}
		if (locals.user.privilege < Privilege.Member) {
			return error(403, 'Not enough privilege');
		}
		const form = await superValidate(request, zod(lineupSchema));
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
			DrawOverSub2Y: form.data.sub2Y,
			Description: form.data.description
		};

		const { success, lineupID: _lineupID } = addLineup(lineup);
		if (!success) {
			return message(form, 'Something went wrong while adding lineup.', { status: 400 });
		}
		const lineupID = _lineupID.toString();
		fs.mkdirSync(path.join(IMAGES_PATH, LINEUP_DIRECTORY, lineupID), { recursive: true });
		await Promise.all([
			writeWebp(
				form.data.throwLineup,
				path.join(LINEUP_DIRECTORY, lineupID, 'throw-lineup.webp'),
				FULL_HD
			),
			writeWebpAnimated(
				form.data.throwGif,
				path.join(LINEUP_DIRECTORY, lineupID, 'throw.webp'),
				FULL_HD
			),
			writeWebp(
				form.data.landSpot,
				path.join(LINEUP_DIRECTORY, lineupID, 'land-spot.webp'),
				FULL_HD
			),
			writeWebp(
				form.data.throwSpotFirstPerson,
				path.join(LINEUP_DIRECTORY, lineupID, 'throw-spot-first-person.webp'),
				FULL_HD
			),
			writeWebp(
				form.data.throwSpotThirdPerson,
				path.join(LINEUP_DIRECTORY, lineupID, 'throw-spot-third-person.webp'),
				FULL_HD
			),
			...form.data.extraImages.map((extraImage, i) =>
				writeWebpNoResize(extraImage, path.join(LINEUP_DIRECTORY, lineupID, `${i + 1}.webp`))
			)
		]);

		return message(form, 'Lineup has been successfully added.');
	}
};
