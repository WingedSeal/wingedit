import { Privilege } from '$lib/server/auth';
import { deleteReferralCode, getReferralCodes } from '$lib/server/db/auth';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return error(401, 'Invalid or missing session');
	}
	const data = await request.formData();
	const deleteCode = data.get('code')! as string;
	if (locals.user.privilege >= Privilege.Admin) {
		deleteReferralCode(deleteCode);
		return json({});
	}

	const codes = getReferralCodes(locals.user.id);
	if (!codes.map((code) => code.Code).includes(deleteCode)) {
		return error(403, 'Unowned code');
	}
	deleteReferralCode(deleteCode);
	return json({});
};
