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
	} catch (error) {
		if (!(error instanceof SqliteError)) {
			throw error;
		}
	}
	return true;
};

export const addLineup = (lineup: Lineup): number => {
	if (lineup.ID) throw Error('Expected lineup without ID');
	return db
		.prepare(
			`
	INSERT INTO 
		"Lineups" (AgentID, AbilityID, MapID, ExtraImageCount, ThrowTypeID, TimeToLand, GradeID,
		CreatedBy, FromMapPositionID, ToMapPositionID, FromX, FromY, ToX, ToY, 
		DrawOverMainX, DrawOverMainY, DrawOverSub1X, DrawOverSub1Y, DrawOverSub2X, DrawOverSub2Y)
	VALUES
		(@AgentID, @AbilityID, @MapID, @ExtraImageCount, @ThrowTypeID, @TimeToLand, @GradeID,
		@CreatedBy, @FromMapPositionID, @ToMapPositionID, @FromX, @FromY, @ToX, @ToY, 
		@DrawOverMainX, @DrawOverMainY, @DrawOverSub1X, @DrawOverSub1Y, @DrawOverSub2X, @DrawOverSub2Y);
	`
		)
		.run(lineup).lastInsertRowid as number;
};
