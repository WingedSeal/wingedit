import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { executeQuery, getTable } from '$lib/server/db/admin';
import Privilege from '$lib/privilege';

const intoStringLiteral = (value: unknown) => {
	if (typeof value !== 'string') {
		const str = JSON.stringify(value);
		return str;
	}
	const str = value.toString();
	return "'" + str.replace("'", "''").slice(1, -1) + "'";
};

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) {
		return error(401, 'Invalid or missing session');
	}
	if (locals.user.privilege < Privilege.Admin) {
		return error(403, 'Not enough privilege');
	}
	if (!url.searchParams.has('tableName')) return error(400, 'Missing tableName in params');
	const tableName = url.searchParams.get('tableName')!;
	const table = getTable(tableName);
	if (!table) {
		return error(400, 'Bad table name');
	}
	if (!table[0]) {
		return json('');
	}
	const columnNames = Object.keys(table[0]) as string[];
	const sql = `INSERT INTO \
"${tableName}" (${columnNames.map((value) => JSON.stringify(value)).join(',')}) \
VALUES \
${table
	.map(
		(row) =>
			'(' +
			Object.values(row)
				.map((value) => intoStringLiteral(value))
				.join(',') +
			')'
	)
	.join(',')};`;

	return json(sql);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return error(401, 'Invalid or missing session');
	}
	if (locals.user.privilege < Privilege.Admin) {
		return error(403, 'Not enough privilege');
	}

	try {
		const { tableName, primaryKeys, columnNames, query } = (await request.json()) as {
			tableName: string;
			primaryKeys: string[];
			columnNames: string[];
			query: {
				delete: [string[], number][];
				add: string[][];
				edit: [string[], string[], number][];
			};
		};
		const returnJson = executeQuery(tableName, primaryKeys, columnNames, query);
		if (!returnJson) {
			return error(400, 'Bad table name');
		}
		return json(returnJson);
	} catch {
		return error(400, 'Unexpected error');
	}
};
