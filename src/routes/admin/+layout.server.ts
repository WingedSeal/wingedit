import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../account/signup/$types';
import Privilege from '$lib/privilege';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user)
		throw redirect(303, `/account/signin?redirect=${event.url.pathname.slice(1)}`);
	if (event.locals.user.privilege < Privilege.Admin) throw redirect(303, '/');

	return {
		user: event.locals.user!
	};
};
