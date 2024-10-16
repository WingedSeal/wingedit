import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import type { Ability, Agent, ValorantMap } from './types';
import type { number } from 'zod';
export const db = new Database(DB_PATH);
// export const db = new Database(DB_PATH, { verbose: console.log });

export const getAgents = () => {
	const rows = db.prepare(`SELECT * FROM "Agents";`).all();
	return rows as Agent[];
};

export const getMaps = () => {
	const rows = db.prepare(`SELECT * FROM "Maps";`).all();
	return rows as ValorantMap[];
};

export const getAbilities = () => {
	const rows = db.prepare(`SELECT * FROM "Abilities";`).all() as Ability[];
	let abilities: { [agent_id: number]: Ability[] } = {};
	rows.forEach((ability) => {
		if (abilities[ability.AgentID]) {
			abilities[ability.AgentID].push(ability);
		} else {
			abilities[ability.AgentID] = [ability];
		}
	});
	return abilities;
};
