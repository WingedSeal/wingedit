import { IMAGES_PATH } from '$env/static/private';
import {
	addLineup,
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
import { FULL_HD, writeWebpNoResize, writeWebp, writeWebpAnimated } from '$lib/server/file-system';
import {
	LINEUP_DIRECTORY,
	lineupActions,
	lineupSchema,
	noImageLineupSchema,
	type DataType
} from '$lib/server/forms/lineup';

export const load = (async ({ locals, url, params }) => {
	if (!locals.user) throw redirect(303, `/account/signin?redirect=${url.pathname.slice(1)}`);
	if (locals.user.privilege < Privilege.Member) throw redirect(303, '/');
	let lineupID: number;
	try {
		lineupID = parseInt(params.lineup_id);
	} catch {
		throw error(404, `${params.lineup_id} is not a valid lineup id.`);
	}

	const lineup = getLineup(lineupID);

	if (!lineup) {
		throw error(404, `Lineup id ${params.lineup_id}  does not exist.`);
	}

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
}) satisfies PageServerLoad;

export const actions = {
	...lineupActions,
	editLineup: async ({ request, locals, params }) => {
		console.log('here');
		if (!locals.user) {
			return error(401, 'Invalid or missing session');
		}
		if (locals.user.privilege < Privilege.Member) {
			return error(403, 'Not enough privilege');
		}
		const form = await superValidate(request, zod(noImageLineupSchema));
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
		throw redirect(
			302,
			`/lineups/${getAgents()[form.data.agent].Name.toLowerCase()}/${getMaps()[form.data.map].Name.toLowerCase()}?lineup=${params.lineup_id}`
		);
		// return message(form, 'lineup was sent to server');
	}
};
