import { lucia } from '$lib/server/auth';
import { verify } from 'argon2';
import type { Actions, PageServerLoad } from './$types';
import { getUser } from '$lib/server/db/auth';
import { fail, setError, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { signinSchema as schema } from '$lib/schema';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(303, '/' + (event.url.searchParams.get('redirect') || ''));
	}
	return {
		form: await superValidate<Infer<typeof schema>, { redirect: boolean }>(zod(schema))
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const existingUser = getUser(form.data.username);

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
			return setError(form, 'username', "Username doesn't exist.");
		}

		const validPassword = await verify(existingUser.HashedPassword, form.data.password);

		if (!validPassword) {
			return setError(form, 'password', 'Password is invalid.');
		}

		const session = await lucia.createSession(existingUser.UserID, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/' + (url.searchParams.get('redirect') || ''));
	}
};
