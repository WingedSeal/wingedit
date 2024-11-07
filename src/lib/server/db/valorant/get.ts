import { db } from '..';
import type {
	Ability,
	Agent,
	AgentRole,
	GameInfo,
	Grade,
	Lineup,
	MapPosition,
	Side,
	ThrowType,
	ValorantMap
} from '../types';

export const getAgents = () => {
	const rows = db.prepare(`SELECT * FROM "Agents";`).all() as Agent[];
	const agents: { [agentID: number]: Agent } = {};
	rows.forEach((agent) => {
		agents[agent.ID] = agent;
	});
	return agents;
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
	const maps: { [mapID: number]: ValorantMap } = {};
	rows.forEach((map) => {
		maps[map.ID] = map;
	});
	return maps;
};

export const isMapPositionExist = (callout: string, mapID: number) => {
	const isExists = db
		.prepare(
			`
SELECT
	1
FROM
	"MapPositions"
WHERE
	"MapID" = @mapID
	AND
	"Callout" = @callout;
`
		)
		.get({ callout, mapID }) as boolean;
	return isExists;
};

export const getGrades = () => {
	const rows = db.prepare(`SELECT * FROM "Grades";`).all() as Grade[];
	const grades: { [gradeID: number]: Grade } = {};
	rows.forEach((grade) => {
		grades[grade.ID] = grade;
	});

	return grades;
};

export const getAbilities = () => {
	const rows = db.prepare(`SELECT * FROM "Abilities";`).all() as Ability[];
	const abilities: { [agentID: number]: { [abilityID: number]: Ability } } = {};
	rows.forEach((ability) => {
		if (!abilities[ability.AgentID]) {
			abilities[ability.AgentID] = {};
		}
		abilities[ability.AgentID][ability.AbilityID] = ability;
	});
	return abilities;
};

export const getAgentAbilities = (agentID: number) => {
	const rows = db
		.prepare(`SELECT * FROM "Abilities" WHERE "AgentID" = @agentID;`)
		.all({ agentID }) as Ability[];
	const abilities: { [abilityID: number]: Ability } = {};
	rows.forEach((ability) => {
		abilities[ability.AbilityID] = ability;
	});
	return abilities;
};

export const getMapPositions = () => {
	const rows = db
		.prepare(
			`
		SELECT 
			*, 
			EXISTS(
				SELECT 1 
				FROM "Lineups" 
				WHERE 
					MapPositions.ID = Lineups.FromMapPositionID 
					OR 
					MapPositions.ID = Lineups.ToMapPositionID
			) as IsUsed
		FROM "MapPositions";
		`
		)
		.all() as ({ IsUsed: boolean } & MapPosition)[];
	const mapPositions: {
		[mapID: number]: { [mapPositionID: number]: { IsUsed: boolean } & MapPosition };
	} = {};
	rows.forEach((mapPosition) => {
		if (!mapPositions[mapPosition.MapID]) {
			mapPositions[mapPosition.MapID] = {};
		}
		mapPositions[mapPosition.MapID][mapPosition.ID] = mapPosition;
	});
	return mapPositions;
};

export const getSides = () => {
	const rows = db.prepare(`SELECT * FROM "Sides";`).all() as Side[];
	const sides: { [sideID: number]: Side } = {};
	rows.forEach((side) => {
		sides[side.ID] = side;
	});
	return sides;
};

export const getThrowTypes = () => {
	const rows = db.prepare(`SELECT * FROM "ThrowTypes";`).all() as ThrowType[];
	const throwTypes: { [throwTypeID: number]: ThrowType } = {};
	rows.forEach((throwType) => {
		throwTypes[throwType.ID] = throwType;
	});
	return throwTypes;
};

export const getGameInfo = (): GameInfo => {
	return {
		agents: getAgents(),
		maps: getMaps(),
		throw_types: getThrowTypes(),
		grades: getGrades(),
		mapPositions: getMapPositions(),
		sides: getSides()
	};
};

export const getLineups = (agentID: number, mapID: number): { [abilityID: number]: Lineup[] } => {
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
	const lineups: { [abilityID: number]: Lineup[] } = {};
	rows.forEach((lineup) => {
		if (!lineups[lineup.AbilityID]) {
			lineups[lineup.AbilityID] = [];
		}
		lineups[lineup.AbilityID].push(lineup);
	});
	return lineups;
};

export const getAllLineups = () => {
	const rows = db.prepare(`SELECT * FROM "Lineups";`).all() as Lineup[];
	return rows;
};
