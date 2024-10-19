import type { PageServerLoad } from './$types';
import { getTables } from '$lib/server/db/index';

export const load: PageServerLoad = async (event) => {
	return {
		tables: getTables()
	};
};
