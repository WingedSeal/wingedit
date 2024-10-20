import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { executeQuery } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	const { tableName, primaryKeys, columnNames, query } = (await request.json()) as {
		tableName: string;
		primaryKeys: string[];
		columnNames: string[];
		query: {
			delete: string[][];
			add: string[][];
			edit: [string[], string[]][];
		};
	};

	return json(executeQuery(tableName, primaryKeys, columnNames, query));
};
