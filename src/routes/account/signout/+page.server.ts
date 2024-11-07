import { fail, redirect, type Cookies } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';

const signOut = async (locals: App.Locals, cookies: Cookies) => {
	if (!locals.session) {
		return fail(401, { message: 'u no logged in' });
	}
	invalidateSession(locals.session.SessionID);
	deleteSessionTokenCookie(cookies);
};

export const load: PageServerLoad = async (event) => {
	await signOut(event.locals, event.cookies);
	throw redirect(302, '/');
};

export const actions: Actions = {
	default: async (event) => {
		await signOut(event.locals, event.cookies);
	}
};
