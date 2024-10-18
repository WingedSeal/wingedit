import { toUserInfo } from '$lib/server/db/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user)
		return {
			user: null
		};
	return {
		user: toUserInfo(event.locals.user)
	};
};
