import Privilege from '$lib/privilege';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user)
		throw redirect(303, `/account/signin?redirect=${event.url.pathname.slice(1)}`);
	if (event.locals.user.privilege < Privilege.Admin) throw redirect(303, '/');

	return {
		user: event.locals.user!
	};
};
