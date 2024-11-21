import Privilege from '$lib/privilege';
import { inviteSchema as schema } from '$lib/schema';
import { generateIdFromEntropySize } from '$lib/server/auth';
import {
	addReferralCode,
	deleteReferralCode,
	getHiddenReferralCodes,
	getReferralCodeCount,
	getReferralCodes
} from '$lib/server/db/auth';
import type { ReferralCode } from '$lib/server/db/types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { fail, message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

const MAX_CODE_COUNT = 4;

export const actions: Actions = {
	new: async ({ request, locals }) => {
		if (!locals.user) {
			return error(401, 'Invalid or missing session');
		}
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		if (form.data.privilege > locals.user.privilege) {
			return error(403, 'Not enough privilege');
		}
		if (form.data.isHideSource && locals.user.privilege < Privilege.Admin) {
			return error(403, 'Not enough privilege');
		}
		const referralCode = generateIdFromEntropySize(10); // 16 characters long
		const codeCount = getReferralCodeCount(locals.user.id);
		if (locals.user.privilege < Privilege.Admin && codeCount >= MAX_CODE_COUNT) {
			return message(
				form,
				{ message: `Maximum active referral count of ${MAX_CODE_COUNT} is reached` },
				{
					status: 403
				}
			);
		}
		const code: ReferralCode = {
			Code: referralCode,
			FromUserID: form.data.isHideSource ? null : locals.user.id,
			Privilege: form.data.privilege
		};
		addReferralCode(code);
		return message(form, {
			code: code.Code,
			message: 'Success'
		});
	},
	del: async ({ request, locals }) => {
		if (!locals.user) {
			return error(401, 'Invalid or missing session');
		}
		const data = await request.formData();
		const deleteCode = data.get('code')! as string;
		if (locals.user.privilege >= Privilege.Admin) {
			deleteReferralCode(deleteCode);
			return;
		}

		const codes = getReferralCodes(locals.user.id);
		if (!codes.map((code) => code.Code).includes(deleteCode)) {
			return error(403, 'Unowned code');
		}
		deleteReferralCode(deleteCode);
	}
};

type FormMessage = {
	code?: string;
	message: string;
};

export const load = async (event: Parameters<PageServerLoad>[0]) => {
	if (!event.locals.user) {
		redirect(303, '/');
	}
	const canHideSource = event.locals.user.privilege >= Privilege.Admin;
	return {
		form: await superValidate<Infer<typeof schema>, FormMessage>(zod(schema)),
		codes: getReferralCodes(event.locals.user.id),
		hiddenCodes: canHideSource ? getHiddenReferralCodes() : null,
		canHideSource
	};
};
