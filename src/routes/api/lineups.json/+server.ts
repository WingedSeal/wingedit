import { getAllLineups } from '$lib/server/db/index.js';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	return json(getAllLineups());
};
