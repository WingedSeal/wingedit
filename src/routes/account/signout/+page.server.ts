import { error, fail, redirect, type Cookies } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';

const signOut = async (locals: App.Locals, cookies: Cookies) => {
	if (!locals.session) {
		return fail(401, { message: 'u no logged in' });
	}
	await lucia.invalidateSession(locals.session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
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
