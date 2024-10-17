import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import type { Ability, Agent, GameInfo, Grade, Lineup, ThrowType, ValorantMap } from './types';
export const db = new Database(DB_PATH);
// export const db = new Database(DB_PATH, { verbose: console.log });

export const getAgents = () => {
	const rows = db.prepare(`SELECT * FROM "Agents";`).all() as Agent[];
	let agents: { [agentID: number]: Agent } = {};
	rows.forEach((agent) => {
		agents[agent.ID] = agent;
	});
	return agents;
};

export const getMaps = () => {
	const rows = db.prepare(`SELECT * FROM "Maps";`).all() as ValorantMap[];
	let maps: { [mapID: number]: ValorantMap } = {};
	rows.forEach((map) => {
		maps[map.ID] = map;
	});
	return maps;
};

export const getGrades = () => {
	const rows = db.prepare(`SELECT * FROM "Grades";`).all() as Grade[];
	let grades: { [gradeID: number]: Grade } = {};
	rows.forEach((grade) => {
		grades[grade.ID] = grade;
	});

	return grades;
};

export const getAbilities = () => {
	const rows = db.prepare(`SELECT * FROM "Abilities";`).all() as Ability[];
	let abilities = new Map<string, Ability>();
	rows.forEach((ability) => {
		abilities.set([ability.AgentID, ability.AbilityID].toString(), ability);
	});
	return abilities;
};

export const getAgentAbilities = () => {
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
	let throwTypes: { [throwTypeID: number]: ThrowType } = {};
	rows.forEach((throwType) => {
		throwTypes[throwType.ID] = throwType;
	});
	return throwTypes;
};

export const getGameInfo = (): GameInfo => {
	return {
		agents: getAgents(),
		maps: getMaps(),
		abilities: getAbilities(),
		throw_types: getThrowTypes(),
		grades: getGrades()
	};
};

export const getLineups = (agentID: number, mapID: number): Lineup[] => {
	const rows = db
		.prepare(
			`
	SELECT
		*
	FROM
		"Lineups"
	WHERE
		"AgentID" = @agentID
		AND "MapID" = @mapID;
	`
		)
		.all({ agentID, mapID }) as Lineup[];
	return rows;
};

export const addLineup = (lineup: Lineup): number => {
	if (lineup.ID) throw Error('Expected lineup without ID');
	return db
		.prepare(
			`
	INSERT INTO 
		"Lineups" (AgentID, AbilityID, MapID, ExtraImageCount, ThrowTypeID, TimeToLand, GradeID)
	VALUES
		(@AgentID, @AbilityID, @MapID, @ExtraImageCount, @ThrowTypeID, @TimeToLand, @GradeID);
	`
		)
		.run(lineup).lastInsertRowid as number;
};
