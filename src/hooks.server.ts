import { DB_PATH, IMAGES_PATH, VALIDATE_IMAGE_SIZE } from '$env/static/private';
import { PUBLIC_REQUIRE_ALL_IMAGES } from '$env/static/public';
import {
	deleteSessionTokenCookie,
	SESSION_COOKIE_NAME,
	setSessionTokenCookie,
	validateSessionToken
} from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

if (!IMAGES_PATH || !DB_PATH || !PUBLIC_REQUIRE_ALL_IMAGES || !VALIDATE_IMAGE_SIZE) {
	throw Error('Missing .env');
}

if (PUBLIC_REQUIRE_ALL_IMAGES !== 'true' && PUBLIC_REQUIRE_ALL_IMAGES !== 'false') {
	throw Error('REQUIRE_ALL_IMAGES is neither true nor false');
}

if (VALIDATE_IMAGE_SIZE !== 'true' && VALIDATE_IMAGE_SIZE !== 'false') {
	throw Error('VALIDATE_IMAGE_SIZE is neither true nor false');
}

const _simulateLatency = (ms: number) => {
	return new Promise((res) => setTimeout(res, ms));
};

export const handle: Handle = async ({ event, resolve }) => {
	// await _simulateLatency(2000);
	const sessionToken = event.cookies.get(SESSION_COOKIE_NAME);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = validateSessionToken(sessionToken);
	if (session) {
		setSessionTokenCookie(event.cookies, sessionToken, session.ExpiresAt);
	} else {
		deleteSessionTokenCookie(event.cookies);
	}
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
