import { db } from '..';
import { SqliteError } from 'better-sqlite3';

export const getTables = () => {
	const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all() as {
		name: string;
	}[];
	return tables.map((table) => table.name);
};

export const getPrimaryKeys = (tableName: string) => {
	if (!tableName.match(/^[a-zA-Z0-9]+$/i)) return null;
	const keys = db
		.prepare(`SELECT name FROM pragma_table_info('${tableName}') WHERE pk >= 1;`)
		.all() as { name: string }[];

	return keys.map((key) => key.name);
};

export const getTable = (tableName: string) => {
	if (!tableName.match(/^[a-zA-Z0-9]+$/i)) return null;
	try {
		return db.prepare(`SELECT * FROM ${tableName} LIMIT 100;`).all() as Record<string, unknown>[];
	} catch (error) {
		if (!(error instanceof SqliteError)) {
			throw error;
		}
		return null;
	}
};
