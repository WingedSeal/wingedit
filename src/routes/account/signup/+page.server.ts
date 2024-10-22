import { lucia } from '$lib/server/auth';
import { generateIdFromEntropySize } from 'lucia';
import { hash } from 'argon2';

import { addUser, deleteReferralCode, getReferralCode, isUsernameExist } from '$lib/server/db/auth';
import type { Actions, PageServerLoad } from './$types';
import type { User } from '$lib/server/db/types';
import { z } from 'zod';
import { fail, message, setError, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(303, '/' + (event.url.searchParams.get('redirectTo') || ''));
	}
	return {
		form: await superValidate<Infer<typeof schema>, { redirect: boolean }>(zod(schema))
	};
};

const schema = z
	.object({
		username: z
			.string()
			.min(4)
			.max(32)
			.regex(/^[a-zA-Z0-9_-]+$/)
			.trim(),
		password: z.string().min(4).max(255).trim(),
		confirmPassword: z.string().min(4).max(255).trim(),
		referralCode: z.string().length(16).trim()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const referralCode = getReferralCode(form.data.referralCode);
		if (!referralCode) {
			return setError(form, 'referralCode', 'Invalid code');
		}
		const userId = generateIdFromEntropySize(10); // 16 characters long
		const passwordHash = await hash(form.data.password, {
			memoryCost: 2 ** 16,
			timeCost: 2,
			hashLength: 32,
			parallelism: 1
		});

		if (isUsernameExist(form.data.username)) {
			return setError(form, 'username', "This username doesn't exist.");
		}
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
		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		return message(form, { redirect: true });
	}
};
