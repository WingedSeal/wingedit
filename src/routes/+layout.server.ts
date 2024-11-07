import { getPrivileges } from '$lib/server/db/auth';
import { type PrivilegeRole } from '$lib/server/db/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user)
		return {
			user: null,
			privileges: {} as {
				[privilege: string]: PrivilegeRole;
			}
		};
	return {
		user: event.locals.user,
		privileges: getPrivileges()
	};
};
