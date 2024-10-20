import { lucia, PEPPER, Privilege } from '$lib/server/auth';
import { generateIdFromEntropySize } from 'lucia';
import { hash } from 'argon2';

import { addUser, isUsernameExist } from '$lib/server/db/auth';
import type { Actions, PageServerLoad } from './$types';
import type { User } from '$lib/server/db/types';
import { z } from 'zod';
import { fail, message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async (event) => {
	return {
		form: await superValidate<Infer<typeof schema>, { redirect: boolean }>(zod(schema)),
		user: event.locals?.user
	};
};

const schema = z.object({
	username: z
		.string()
		.min(4)
		.max(32)
		.regex(/^[a-zA-Z0-9_-]+$/)
		.trim(),
	password: z.string().min(4).max(255).trim(),
	referralCode: z.string().length(16).trim()
});

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const userId = generateIdFromEntropySize(10); // 16 characters long
		const passwordHash = await hash(form.data.password + PEPPER, {
			memoryCost: 2 ** 16,
			timeCost: 2,
			hashLength: 32,
			parallelism: 1
		});

		if (isUsernameExist(form.data.username)) {
			return fail(400, { form });
		}
		const user: User = {
			UserID: userId,
			Username: form.data.username,
			HashedPassword: passwordHash,
			Privilege: Privilege.Admin // TODO
		};

		addUser(user);

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		return message(form, { redirect: true });
	}
};
