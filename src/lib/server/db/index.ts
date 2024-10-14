import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import type { Agent, ValorantMap } from './types';
export const db = new Database(DB_PATH);
// export const db = new Database(DB_PATH, { verbose: console.log });

export const getAgents = () => {
	const rows = db.prepare(`SELECT * FROM "Agents";`).all();
	console.log(rows);
	return rows as Agent[];
};

export const getMaps = () => {
	const rows = db.prepare(`SELECT * FROM "Maps";`).all();
	console.log(rows);
	return rows as ValorantMap[];
};
