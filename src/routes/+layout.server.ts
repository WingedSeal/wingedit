import { toUserInfo } from '$lib/server/db/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user)
		return {
			user: null
		};
	return {
		user: toUserInfo(event.locals.user)
	};
};
