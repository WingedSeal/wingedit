import { toUserInfo } from '$lib/server/db/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return {
		user: toUserInfo(event.locals.user!)
	};
};
