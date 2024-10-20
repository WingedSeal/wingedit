import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { executeQuery } from '$lib/server/db';
import { lucia } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request }) => {
	const cookieHeader = request.headers.get('Cookie');
	const sessionId = lucia.readSessionCookie(cookieHeader ?? '');
	const { user } = await lucia.validateSession(sessionId ?? '');
	if (!user) {
		return error(401, 'Invalid or missing session');
	}
	if (user.privilege < 1) {
		return error(403, 'Not enough privilege');
	}

	try {
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
		const returnJson = executeQuery(tableName, primaryKeys, columnNames, query);
		if (!returnJson) {
			return error(400, 'Bad table name');
		}
		return json(returnJson);
	} catch {
		return error(400, 'Unexpected error');
	}
};
