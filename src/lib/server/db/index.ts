import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
export const db = new Database(DB_PATH);
// export const db = new Database(DB_PATH, { verbose: console.log });

export const getTables = () => {
	let tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all() as {
		name: string;
	}[];
	return tables.map((table) => table.name);
};
