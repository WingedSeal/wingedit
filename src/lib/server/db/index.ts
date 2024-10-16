import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import type { Ability, Agent, Lineup, ThrowType, ValorantMap } from './types';
import { uuid } from 'uuidv4';
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
	let abilities: { [agentID: number]: Ability[] } = {};
	rows.forEach((ability) => {
		if (abilities[ability.AgentID]) {
			abilities[ability.AgentID].push(ability);
		} else {
			abilities[ability.AgentID] = [ability];
		}
	});
	return abilities;
};

export const getThrowTypes = () => {
	const rows = db.prepare(`SELECT * FROM "ThrowTypes";`).all() as ThrowType[];
	let throwTypes: { [name: string]: ThrowType } = {};
	rows.forEach((throwType) => {
		throwTypes[throwType.Name] = throwType;
	});
	return throwTypes;
};

export const addLineup = (lineup: Lineup): string => {
	if (lineup.UUID) throw Error('Expected lineup without UUID');
	lineup.UUID = uuid();
	db.prepare(
		`
	INSERT INTO 
		"Lineups" (UUID, AbilityID, MapID, ExtraImageCount, ThrowTypeID, TimeToLand)
	VALUES
		(@UUID, @AbilityID, @MapID, @ExtraImageCount, @ThrowTypeID, @TimeToLand);
	`
	).run(lineup);
	return lineup.UUID;
};
