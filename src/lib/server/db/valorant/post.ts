import { db } from '..';
import { SqliteError } from 'better-sqlite3';
import type { Ability, Agent, Lineup } from '../types';

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
		db.prepare(
			`
		INSERT INTO 
			"Abilities" (AgentID, AbilityID, Name)
		VALUES
			(@AgentID, @AbilityID, @Name);
		`
		).run(ability);
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
		const lastID = db
			.prepare(
				`
			SELECT
				ID
			FROM
				"MapPositions"
			WHERE
				"MapID" = ?
			ORDER BY
				ID DESC
			LIMIT
				1;`
			)
			.get(mapID) as { ID: number } | undefined;
		const ID = lastID ? lastID.ID + 1 : 1;
		db.prepare(
			`
			INSERT INTO
				"MapPositions" ("ID", "MapID", "Callout")
			VALUES
				(@ID, @mapID, @callout);
			`
		).run({ ID, callout, mapID });
		return { success: true, newID: ID };
	} catch (error) {
		if (!(error instanceof SqliteError)) {
			throw error;
		}
		return { success: false, newID: -1 };
	}
};

export const addLineup = (lineup: Lineup): number => {
	if (lineup.ID) throw Error('Expected lineup without ID');
	return db
		.prepare(
			`
	INSERT INTO 
		"Lineups" (AgentID, AbilityID, MapID, ExtraImageCount, ThrowTypeID, TimeToLand, GradeID, Difficulty,
		SideID, CreatedBy, FromMapPositionID, ToMapPositionID, FromX, FromY, ToX, ToY, 
		DrawOverMainX, DrawOverMainY, DrawOverSub1X, DrawOverSub1Y, DrawOverSub2X, DrawOverSub2Y)
	VALUES
		(@AgentID, @AbilityID, @MapID, @ExtraImageCount, @ThrowTypeID, @TimeToLand, @GradeID, @Difficulty,
		@SideID, @CreatedBy, @FromMapPositionID, @ToMapPositionID, @FromX, @FromY, @ToX, @ToY, 
		@DrawOverMainX, @DrawOverMainY, @DrawOverSub1X, @DrawOverSub1Y, @DrawOverSub2X, @DrawOverSub2Y);
	`
		)
		.run(lineup).lastInsertRowid as number;
};
