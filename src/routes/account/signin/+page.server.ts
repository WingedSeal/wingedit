import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { verify } from 'argon2';
import { page } from '$app/stores';
import type { Actions, PageServerLoad } from './$types';
import { getUser } from '$lib/server/db/auth';
import { PEPPER } from '$lib/server/auth';
import { message } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user)
		return {
			username: null
		};
	return {
		username: event.locals.user.username
	};
};

export const actions: Actions = {
	signin: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		const existingUser = getUser(username);

		if (!existingUser) {
			// NOTE:
			// Returning immediately allows malicious actors to figure out valid usernames from response times,
			// allowing them to only focus on guessing passwords in brute-force attacks.
			// As a preventive measure, you may want to hash passwords even for invalid usernames.
			// However, valid usernames can be already be revealed with the signup page among other methods.
			// It will also be much more resource intensive.
			// Since protecting against this is non-trivial,
			// it is crucial your implementation is protected against brute-force attacks with login throttling etc.
			// If usernames are public, you may outright tell the user that the username is invalid.
			return fail(400, {
				message: 'no username'
			});
		}

		const validPassword = await verify(existingUser.HashedPassword, password + PEPPER);

		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const session = await lucia.createSession(existingUser.UserID, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes
		});
		return {
			redirect: true
		};
	},
	signout: async (event) => {
		if (!event.locals.session) {
			return fail(401, { message: 'u no logged in' });
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		return {
			message: 'logged out'
		};
	}
};
