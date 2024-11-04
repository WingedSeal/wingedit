import { getPrivileges } from '$lib/server/db/auth';
import { toUserInfo } from '$lib/server/db/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user)
		return {
			user: null,
			privileges: []
		};
	return {
		user: toUserInfo(event.locals.user),
		privileges: getPrivileges()
	};
};
