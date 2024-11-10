import { db } from '..';
import { SqliteError } from 'better-sqlite3';
import { lineupKeys, type Ability, type Agent, type Lineup } from '../types';

const statements = {
	addAgent: db.prepare(
		`
INSERT INTO 
	"Agents" (ID, Name, RoleID)
VALUES
	(@ID, @Name, @RoleID);`
	),
	addAbility: db.prepare(
		`
INSERT INTO 
	"Abilities" (AgentID, AbilityID, Name)
VALUES
	(@AgentID, @AbilityID, @Name);`
	),
	addMapPosition: db.prepare(
		`
INSERT INTO
	"MapPositions" ("MapID", "Callout")
VALUES
	(@mapID, @callout);`
	),

	addLineup: db.prepare(
		`
INSERT INTO 
	"Lineups" (${lineupKeys.join(', ')})
VALUES
	(${lineupKeys.map((key) => '@' + key).join(', ')});
`
	),
	deleteMapPosition: db.prepare(
		`
DELETE FROM
	"MapPositions"
WHERE
	ID = ?;`
	)
} as const;

export const addAgentAndAbilities = (
	agent: Agent,
	abilities: Ability[]
): { errorPath: string; errorMessage: string } | null => {};

export const addAgent = (agent: Agent): boolean => {
	try {
		statements.addAgent.run(agent);
	} catch (error) {
		if (!(error instanceof SqliteError)) {
			throw error;
		}
		return false;
	}
	return true;
};

export const addAbility = (ability: Ability): boolean => {
	try {
		statements.addAbility.run(ability);
	} catch (error) {
		if (!(error instanceof SqliteError)) {
			throw error;
		}
		return false;
	}
	return true;
};

export const addMapPosition = (
	callout: string,
	mapID: number
): { success: boolean; newID: number } => {
	try {
		const ID = statements.addMapPosition.run({ callout, mapID }).lastInsertRowid as number;
		return { success: true, newID: ID };
	} catch (error) {
		if (!(error instanceof SqliteError)) {
			throw error;
		}
		return { success: false, newID: -1 };
	}
};

export const deleteMapPosition = (mapPositionID: number): boolean => {
	try {
		statements.deleteMapPosition.run(mapPositionID);
		return true;
	} catch (error) {
		if (!(error instanceof SqliteError)) {
			throw error;
		}
		return false;
	}
};

export const addLineup = (lineup: Lineup): { success: boolean; lineupID: number } => {
	if (lineup.ID) throw Error('Expected lineup without ID');
	try {
		const ID = statements.addLineup.run(lineup).lastInsertRowid as number;
		return { success: true, lineupID: ID };
	} catch (error) {
		if (!(error instanceof SqliteError)) {
			throw error;
		}
		return { success: false, lineupID: -1 };
	}
};
