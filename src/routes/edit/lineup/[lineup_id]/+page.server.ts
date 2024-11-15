import { IMAGES_PATH } from '$env/static/private';
import {
	addLineup,
	deleteLineup,
	editLineup,
	getAbilities,
	getAgents,
	getGameInfo,
	getLineup,
	getMaps
} from '$lib/server/db/valorant';
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
import {
	LINEUP_DIRECTORY,
	lineupActions,
	noImageLineupSchema,
	type DataType
} from '$lib/server/forms/lineup';
import { FULL_HD, writeWebp, writeWebpAnimated, writeWebpNoResize } from '$lib/server/file-system';

export const load: PageServerLoad = async ({ locals, url, params }) => {
	if (!locals.user) throw redirect(303, `/account/signin?redirect=${url.pathname.slice(1)}`);
	if (locals.user.privilege < Privilege.Member) throw redirect(303, '/');
	let lineupID = parseInt(params.lineup_id);
	if (isNaN(lineupID)) throw error(404, `${params.lineup_id} is not a valid lineup id.`);

	const lineup = getLineup(lineupID);

	if (!lineup) {
		throw error(404, `Lineup id ${params.lineup_id} does not exist.`);
	}

	if (locals.user.privilege < Privilege.Moderator && locals.user.id !== lineup.CreatedBy)
		throw redirect(303, '/');

	let lineupForm = await superValidate<Infer<typeof noImageLineupSchema>, string>(
		zod(noImageLineupSchema)
	);

	lineupForm.data = {
		ability: lineup.AbilityID,
		agent: lineup.AgentID,
		description: lineup.Description,
		difficulty: lineup.Difficulty,
		extraImages: [],
		from: lineup.FromMapPositionID,
		fromX: lineup.FromX,
		fromY: lineup.FromY,
		grade: lineup.GradeID,
		landSpot: null,
		mainX: lineup.DrawOverMainX,
		mainY: lineup.DrawOverMainY,
		map: lineup.MapID,
		side: lineup.SideID,
		sub1X: lineup.DrawOverSub1X,
		sub1Y: lineup.DrawOverSub1Y,
		sub2X: lineup.DrawOverSub2X,
		sub2Y: lineup.DrawOverSub2Y,
		throwGif: null,
		throwLineup: null,
		throwSpotFirstPerson: null,
		throwSpotThirdPerson: null,
		throwType: lineup.ThrowTypeID,
		timeToLand: lineup.TimeToLand,
		to: lineup.ToMapPositionID,
		toX: lineup.ToX,
		toY: lineup.ToY
	};

	const data: DataType = {
		lineupForm,
		mapPositionForm: await superValidate<
			Infer<typeof mapPositionSchema>,
			{ message: string; newMapPosition: MapPosition; mapID: number }
		>(zod(mapPositionSchema)),
		mapPositionDeleteForm: await superValidate<
			Infer<typeof mapPositionDeleteSchema>,
			{ message: string; deletedMapPosition: MapPosition }
		>(zod(mapPositionDeleteSchema)),
		gameInfo: getGameInfo(),
		abilities: getAbilities(),
		lineupID
	};
	return data;
};

export const actions = {
	...lineupActions,
	deleteLineup: async ({ locals, params }) => {
		if (!locals.user) {
			return error(401, 'Invalid or missing session');
		}
		if (locals.user.privilege < Privilege.Member) {
			return error(403, 'Not enough privilege');
		}
		let lineupID = parseInt(params.lineup_id);
		if (isNaN(lineupID)) throw error(400, `${params.lineup_id} is not a valid lineup id.`);

		const lineup = getLineup(lineupID);

		if (!lineup) {
			throw error(400, `Lineup id ${params.lineup_id} does not exist.`);
		}
		if (locals.user.privilege < Privilege.Moderator && locals.user.id !== lineup.CreatedBy) {
			return error(403, 'User id does not match lineup creator');
		}

		deleteLineup(lineupID);

		fs.rm(
			path.join(IMAGES_PATH, LINEUP_DIRECTORY, params.lineup_id),
			{
				recursive: true,
				force: true
			},
			() => {}
		);

		throw redirect(
			302,
			`/lineups/${getAgents()[lineup.AgentID].Name.toLowerCase()}/${getMaps()[lineup.MapID].Name.toLowerCase()}`
		);
	},
	editLineup: async ({ request, locals, params }) => {
		if (!locals.user) {
			return error(401, 'Invalid or missing session');
		}
		if (locals.user.privilege < Privilege.Member) {
			return error(403, 'Not enough privilege');
		}
		let lineupID = parseInt(params.lineup_id);

		if (isNaN(lineupID)) throw error(400, `${params.lineup_id} is not a valid lineup id.`);

		const oldLineup = getLineup(lineupID);

		if (!oldLineup) {
			throw error(400, `Lineup id ${params.lineup_id} does not exist.`);
		}
		if (locals.user.privilege < Privilege.Moderator && locals.user.id !== oldLineup.CreatedBy) {
			return error(403, 'User id does not match lineup creator');
		}

		const form = await superValidate(request, zod(noImageLineupSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const lineup: Lineup = {
			ID: lineupID,
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

		const success = editLineup(lineup);
		if (!success) {
			return message(form, 'Something went wrong while editing lineup.', { status: 400 });
		}

		await Promise.all([
			(async () => {
				const files = fs.readdirSync(path.join(IMAGES_PATH, LINEUP_DIRECTORY, params.lineup_id));
				await Promise.all(
					files.map((fileName) => {
						let fileNumber = parseInt(fileName.split('.')[0]);
						if (isNaN(fileNumber)) return;
						if (fileNumber > form.data.extraImages.length) {
							return fs.promises.unlink(
								path.join(IMAGES_PATH, LINEUP_DIRECTORY, params.lineup_id, fileName)
							);
						}
					})
				);
			})(),

			writeWebp(
				form.data.throwLineup,
				path.join(LINEUP_DIRECTORY, params.lineup_id, 'throw-lineup.webp'),
				FULL_HD
			),
			writeWebpAnimated(
				form.data.throwGif,
				path.join(LINEUP_DIRECTORY, params.lineup_id, 'throw.webp'),
				FULL_HD
			),
			writeWebp(
				form.data.landSpot,
				path.join(LINEUP_DIRECTORY, params.lineup_id, 'land-spot.webp'),
				FULL_HD
			),
			writeWebp(
				form.data.throwSpotFirstPerson,
				path.join(LINEUP_DIRECTORY, params.lineup_id, 'throw-spot-first-person.webp'),
				FULL_HD
			),
			writeWebp(
				form.data.throwSpotThirdPerson,
				path.join(LINEUP_DIRECTORY, params.lineup_id, 'throw-spot-third-person.webp'),
				FULL_HD
			),
			...form.data.extraImages.map((extraImage, i) =>
				writeWebpNoResize(
					extraImage,
					path.join(LINEUP_DIRECTORY, params.lineup_id, `${i + 1}.webp`)
				)
			)
		]);

		throw redirect(
			302,
			`/lineups/${getAgents()[form.data.agent].Name.toLowerCase()}/${getMaps()[form.data.map].Name.toLowerCase()}?lineup=${params.lineup_id}`
		);
	}
};
