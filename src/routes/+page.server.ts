import { getPrivileges } from '$lib/server/db/auth';
import type { PageServerLoad } from './lineups/$types';

export const load: PageServerLoad = async () => {
	return {
		privileges: getPrivileges()
	};
};
