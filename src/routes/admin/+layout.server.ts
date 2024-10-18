import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../account/signup/$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user)
		throw redirect(303, `/account/signin?redirectTo=${event.url.pathname.slice(1)}`);
	if (event.locals.user.privilege < 1) throw redirect(303, '/');
};
