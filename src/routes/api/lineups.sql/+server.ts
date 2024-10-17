import { getAllLineups } from '$lib/server/db/index.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET = (async () => {
	let values = '';
	getAllLineups().forEach((lineup) => {
		values += JSON.stringify(Object.values(lineup)).replace('[', '(').replace(']', ')') + ' ';
	});
	return json(
		'INSERT INTO \
`Lineups` (AgentID, AbilityID, MapID, ExtraImageCount, ThrowTypeID, TimeToLand, GradeID, \
DrawOverMainX, DrawOverMainY, DrawOverSub1X, DrawOverSub1Y, DrawOverSub2X, DrawOverSub2Y) \
VALUES ' + values.slice(0, -1)
	);
}) satisfies RequestHandler;
