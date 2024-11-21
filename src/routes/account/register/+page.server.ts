import { hash } from 'argon2';

import { registerSchema as schema } from '$lib/schema';
import {
	createSession,
	generateIdFromEntropySize,
	generateSessionToken,
	setSessionTokenCookie
} from '$lib/server/auth';
import { addUser, deleteReferralCode, getReferralCode, isUsernameExist } from '$lib/server/db/auth';
import type { User } from '$lib/server/db/types';
import { redirect } from '@sveltejs/kit';
import { fail, setError, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

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
		const referralCode = getReferralCode(form.data.referralCode);
		if (!referralCode) {
			return setError(form, 'referralCode', 'Invalid code');
		}
		const userId = generateIdFromEntropySize(10); // 16 characters long

		if (isUsernameExist(form.data.username)) {
			return setError(form, 'username', 'This username already exist.');
		}
		const passwordHash = await hash(form.data.password, {
			memoryCost: 64 * 1024,
			timeCost: 3,
			hashLength: 32,
			parallelism: 4
		});
		const user: User = {
			UserID: userId,
			Username: form.data.username,
			HashedPassword: passwordHash,
			Privilege: referralCode.Privilege,
			ReferredByUserID: referralCode.FromUserID,
			CreationTimestamp: Date.now()
		};

		addUser(user);
		deleteReferralCode(referralCode.Code);
		const sessionToken = generateSessionToken();
		const session = createSession(sessionToken, user.UserID);
		setSessionTokenCookie(cookies, sessionToken, session.ExpiresAt);
		redirect(302, '/' + (url.searchParams.get('redirect') || ''));
	}
};
