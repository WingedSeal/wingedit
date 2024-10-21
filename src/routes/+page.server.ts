import { getPrivileges, toUserInfo } from '$lib/server/db/auth';
import type { PageServerLoad } from './lineups/$types';

export const load: PageServerLoad = async (event) => {
	return {
		privileges: getPrivileges()
	};
};
