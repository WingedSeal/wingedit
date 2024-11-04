import type { Actions, PageServerLoad } from './$types';
import { getTables, getTable, getPrimaryKeys } from '$lib/server/db/admin';
import { error, fail } from '@sveltejs/kit';
import Privilege from '$lib/privilege';

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
	return {
		tables: getTables()
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			return error(401, 'Invalid or missing session');
		}
		if (locals.user.privilege < Privilege.Admin) {
			return error(403, 'Not enough privilege');
		}
		const form = await request.formData();
		const tableName = form.get('tableName') as string;
		if (!tableName) return fail(400);
		const table = getTable(tableName);
		if (!table) return fail(400);

		return {
			tableName,
			table,
			primaryKeys: getPrimaryKeys(tableName)
		};
	}
};
