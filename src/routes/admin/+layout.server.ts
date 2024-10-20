import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../account/signup/$types';
import { toUserInfo } from '$lib/server/db/auth';
import { Privilege } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user)
		throw redirect(303, `/account/signin?redirectTo=${event.url.pathname.slice(1)}`);
	if (event.locals.user.privilege < Privilege.Admin) throw redirect(303, '/');

	return {
		user: toUserInfo(event.locals.user!)
	};
};
