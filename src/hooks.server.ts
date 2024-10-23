import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { IMAGES_PATH, DB_PATH, REQUIRE_ALL_IMAGES } from '$env/static/private';

if (!IMAGES_PATH || !DB_PATH || !REQUIRE_ALL_IMAGES) {
	throw Error('Missing .env');
}

if (REQUIRE_ALL_IMAGES !== 'true' && REQUIRE_ALL_IMAGES !== 'false') {
	throw Error('REQUIRE_ALL_IMAGES is neither true nor false');
}

const simulateLatency = (ms: number) => {
	return new Promise((res) => setTimeout(res, ms));
};

export const handle: Handle = async ({ event, resolve }) => {
	// await simulateLatency(1000);
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
