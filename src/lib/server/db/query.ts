import { db } from '.';
import { SqliteError } from 'better-sqlite3';
import type {
	Ability,
	Agent,
	AgentRole,
	GameInfo,
	Grade,
	Lineup,
	MapPosition,
	ThrowType,
	ValorantMap
} from './types';

export const getAgents = () => {
	const rows = db.prepare(`SELECT * FROM "Agents";`).all() as Agent[];
	let agents: { [agentID: number]: Agent } = {};
	rows.forEach((agent) => {
		agents[agent.ID] = agent;
	});
	return agents;
};

export const addAgent = (agent: Agent): boolean => {
	try {
		db.prepare(
			`
		INSERT INTO 
			"Agents" (ID, Name, RoleID)
		VALUES
			(@ID, @Name, @RoleID);
		`
		).run(agent);
	} catch (SqliteError) {
		return false;
	}
	return true;
};

export const addAbility = (ability: Ability): boolean => {
	try {
		db.prepare(
			`
		INSERT INTO 
			"Abilities" (AgentID, AbilityID, Name, NameID)
		VALUES
			(@AgentID, @AbilityID, @Name, @NameID);
		`
		).run(ability);
	} catch (SqliteError) {
		return false;
	}
	return true;
};

export const getLastAgentID = () => {
	const agentID = db
		.prepare(
			`
SELECT
	ID
FROM
	"Agents"
ORDER BY
	ID DESC
LIMIT
	1;`
		)
		.get() as { ID: number };
	return agentID.ID;
};

export const getAgentRoles = () => {
	const rows = db.prepare(`SELECT * FROM "AgentRoles";`).all() as AgentRole[];
	return rows;
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
	let abilities: { [agentID: number]: { [abilityID: number]: Ability } } = {};
	rows.forEach((ability) => {
		if (!abilities[ability.AgentID]) {
			abilities[ability.AgentID] = {};
		}
		abilities[ability.AgentID][ability.AbilityID] = ability;
	});
	return abilities;
};

export const getMapPositions = () => {
	const rows = db.prepare(`SELECT * FROM "MapPositions";`).all() as MapPosition[];
	let mapPositions: { [mapID: number]: { [mapPositionID: number]: MapPosition } } = {};
	rows.forEach((mapPosition) => {
		if (!mapPositions[mapPosition.MapID]) {
			mapPositions[mapPosition.MapID] = {};
		}
		mapPositions[mapPosition.MapID][mapPosition.ID] = mapPosition;
	});
	return mapPositions;
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
		"Lineups" (AgentID, AbilityID, MapID, ExtraImageCount, ThrowTypeID, TimeToLand, GradeID, 
		DrawOverMainX, DrawOverMainY, DrawOverSub1X, DrawOverSub1Y, DrawOverSub2X, DrawOverSub2Y)
	VALUES
		(@AgentID, @AbilityID, @MapID, @ExtraImageCount, @ThrowTypeID, @TimeToLand, @GradeID,
		@DrawOverMainX, @DrawOverMainY, @DrawOverSub1X, @DrawOverSub1Y, @DrawOverSub2X, @DrawOverSub2Y);
	`
		)
		.run(lineup).lastInsertRowid as number;
};

export const getAllLineups = () => {
	const rows = db.prepare(`SELECT * FROM "Lineups";`).all() as Lineup[];
	return rows;
};
