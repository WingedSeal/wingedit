import { lucia, PEPPER, Privilege } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { hash } from 'argon2';

import { addUser, isUsernameExist } from '$lib/server/db/auth';
import type { Actions, PageServerLoad } from './$types';
import type { User } from '$lib/server/db/types';

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
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
		// keep in mind some database (e.g. mysql) are case insensitive
		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				error: true,
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				error: true,
				message: 'Invalid password'
			});
		}

		const userId = generateIdFromEntropySize(10); // 16 characters long
		const passwordHash = await hash(password + PEPPER, {
			// recommended minimum parameters
			memoryCost: 2 ** 16,
			timeCost: 2,
			hashLength: 32,
			parallelism: 1
		});

		if (isUsernameExist(username)) {
			return fail(400, {
				error: true,
				message: 'Username exists'
			});
		}
		const user: User = {
			UserID: userId,
			Username: username,
			HashedPassword: passwordHash,
			Privilege: Privilege.Admin
		};

		addUser(user);

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes
		});
		return {
			redirect: true
		};
	}
};
