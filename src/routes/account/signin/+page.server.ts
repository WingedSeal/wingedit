import { verify } from 'argon2';
import type { Actions, PageServerLoad } from './$types';
import { getUser } from '$lib/server/db/auth';
import { fail, setError, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { signinSchema as schema } from '$lib/schema';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';

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
			return setError(form, 'username', "Username doesn't exist.");
		}

		const validPassword = await verify(existingUser.HashedPassword, form.data.password);

		if (!validPassword) {
			return setError(form, 'password', 'Password is invalid.');
		}

		const sessionToken = generateSessionToken();
		const session = createSession(sessionToken, existingUser.UserID);
		setSessionTokenCookie(cookies, sessionToken, session.ExpiresAt);

		redirect(302, '/' + (url.searchParams.get('redirect') || ''));
	}
};
