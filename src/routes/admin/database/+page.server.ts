import type { Actions, PageServerLoad } from './$types';
import { getTables, getTable, getPrimaryKeys } from '$lib/server/db/index';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	return {
		tables: getTables()
	};
};

export const actions: Actions = {
	getTable: async ({ request }) => {
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
