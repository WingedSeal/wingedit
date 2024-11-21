import { VALIDATE_IMAGE_SIZE } from '$env/static/private';
import { mapPositionDeleteSchema } from '$lib/hidden-schema';
import Privilege from '$lib/privilege';
import { getLineupSchema, mapPositionSchema } from '$lib/schema';
import { error, type RequestEvent } from '@sveltejs/kit';
import sharp from 'sharp';
import {
	fail,
	message,
	setError,
	superValidate,
	type Infer,
	type SuperValidated
} from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { GameInfo, MapPosition } from '../db/types';
import type { getAbilities } from '../db/valorant';
import {
	addMapPosition,
	deleteMapPosition,
	getMapPosition,
	getMaps,
	isMapPositionExist,
	isMapPositionUsed
} from '../db/valorant';

export const lineupSchema =
	VALIDATE_IMAGE_SIZE === 'true'
		? getLineupSchema({
				refineImage: async (f) => {
					const size = await sharp(await f.arrayBuffer()).metadata();
					return (size.width &&
						size.height &&
						size.width * 9 === size.height * 16 &&
						size.width >= 1920) as boolean;
				},
				refineImageError: 'Please upload 1920x1080 image.',
				refineGif: async (f) => {
					const size = await sharp(await f.arrayBuffer()).metadata();
					return (size.width &&
						size.height &&
						size.width * 9 === size.height * 16 &&
						size.width >= 1920) as boolean;
				},
				refineGifError: 'Please upload 1920x1080 gif.'
			})
		: getLineupSchema();

export const noImageLineupSchema = getLineupSchema(null, false);

export type DataType = {
	lineupForm: SuperValidated<
		Infer<typeof lineupSchema> | Infer<typeof noImageLineupSchema>,
		string,
		Infer<typeof lineupSchema> | Infer<typeof noImageLineupSchema>
	>;
	mapPositionForm: SuperValidated<
		Infer<typeof mapPositionSchema>,
		{ message: string; newMapPosition: MapPosition; mapID: number },
		Infer<typeof mapPositionSchema>
	>;
	mapPositionDeleteForm: SuperValidated<
		Infer<typeof mapPositionDeleteSchema>,
		{ message: string; deletedMapPosition: MapPosition },
		Infer<typeof mapPositionDeleteSchema>
	>;
	gameInfo: GameInfo;
	abilities: ReturnType<typeof getAbilities>;
	lineupID?: number;
};

export const LINEUP_DIRECTORY = 'lineups';

export const cleanupCallout = (callout: string): string => {
	return callout
		.split(/\s+/)
		.map((text) => {
			text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
			if (text === 'Ct') {
				return 'CT';
			}
			return text;
		})
		.join(' ');
};

export const lineupActions: { [name: string]: (event: RequestEvent) => {} } = {
	addMapPosition: async ({ request, locals }) => {
		if (!locals.user) {
			return error(401, 'Invalid or missing session');
		}
		if (locals.user.privilege < Privilege.Member) {
			return error(403, 'Not enough privilege');
		}
		let form = await superValidate(request, zod(mapPositionSchema));
		form.data.callout = cleanupCallout(form.data.callout);
		if (!form.valid) {
			return fail(400, { form });
		}
		if (isMapPositionExist(form.data.callout, form.data.mapID))
			return setError(
				form,
				'callout',
				`Callout '${form.data.callout}' already exists in map '${getMaps()[form.data.mapID].Name}'`
			);

		const { success, newID } = addMapPosition(form.data.callout, form.data.mapID);
		if (!success) {
			return setError(
				form,
				'callout',
				`Something went wrong. Failed to add new map position '${form.data.callout}'.`
			);
		}
		const newMapPosition: MapPosition = {
			ID: newID,
			MapID: form.data.mapID,
			Callout: form.data.callout
		};
		const callout = form.data.callout;
		form.data.callout = '';
		return message(form, {
			message: `Callout '${callout}' was added successfully.`,
			newMapPosition,
			mapID: form.data.mapID
		});
	},
	deleteMapPosition: async ({ request, locals }) => {
		if (!locals.user) {
			return error(401, 'Invalid or missing session');
		}
		if (locals.user.privilege < Privilege.Member) {
			return error(403, 'Not enough privilege');
		}
		const form = await superValidate(request, zod(mapPositionDeleteSchema));
		if (!form.valid) {
			return fail(400);
		}
		const mapPositionID = form.data.mapPositionID;
		const mapPosition = getMapPosition(mapPositionID);
		if (!mapPosition) {
			return setError(form, 'mapPositionID', 'This map position has already been deleted!');
		}

		if (isMapPositionUsed(mapPositionID)) {
			return setError(
				form,
				'mapPositionID',
				`This map position ${JSON.stringify(mapPosition.Callout)} has already been used!`
			);
		}

		if (!deleteMapPosition(mapPositionID)) {
			return setError(
				form,
				'mapPositionID',
				`Something went wrong while deleting ${JSON.stringify(mapPosition.Callout)}.`
			);
		}
		return message(form, {
			message: `${JSON.stringify(mapPosition.Callout)} has successfully been deleted.`,
			deletedMapPosition: mapPosition
		});
	}
};
