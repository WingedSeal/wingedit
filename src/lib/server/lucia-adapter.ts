import type {
	Adapter,
	DatabaseSession,
	RegisteredDatabaseSessionAttributes,
	DatabaseUser,
	RegisteredDatabaseUserAttributes,
	UserId
} from 'lucia';
import type { Database } from 'better-sqlite3';

const COL_NAMES = {
	session: {
		id: 'SessionID',
		expires_at: 'ExpiresAt',
		user_id: 'UserID'
	},
	user: {
		id: 'UserID'
	}
};

class BetterSqlite3Controller implements Controller {
	private db: Database;
	constructor(db: Database) {
		this.db = db;
	}

	public async get<T>(sql: string, args: any[]): Promise<T | null> {
		return this.db.prepare(sql).get(...args) as T | null;
	}

	public async getAll<T>(sql: string, args: any[]): Promise<T[]> {
		return this.db.prepare(sql).all(...args) as T[];
	}

	public async execute(sql: string, args: any[]): Promise<void> {
		this.db.prepare(sql).run(...args);
	}
}

class SQLiteAdapter implements Adapter {
	private controller: Controller;

	private escapedUserTableName: string;
	private escapedSessionTableName: string;

	constructor(controller: Controller, tableNames: TableNames) {
		this.controller = controller;
		this.escapedSessionTableName = escapeName(tableNames.session);
		this.escapedUserTableName = escapeName(tableNames.user);
	}

	public async deleteSession(sessionId: string): Promise<void> {
		await this.controller.execute(
			`DELETE FROM ${this.escapedSessionTableName} WHERE ${COL_NAMES.session.id} = ?`,
			[sessionId]
		);
	}

	public async deleteUserSessions(userId: UserId): Promise<void> {
		await this.controller.execute(
			`DELETE FROM ${this.escapedSessionTableName} WHERE ${COL_NAMES.session.user_id} = ?`,
			[userId]
		);
	}

	public async getSessionAndUser(
		sessionId: string
	): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
		const [databaseSession, databaseUser] = await Promise.all([
			this.getSession(sessionId),
			this.getUserFromSessionId(sessionId)
		]);
		return [databaseSession, databaseUser];
	}

	public async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
		const result = await this.controller.getAll<SessionSchema>(
			`SELECT * FROM ${this.escapedSessionTableName} WHERE ${COL_NAMES.session.user_id} = ?`,
			[userId]
		);
		return result.map((val) => {
			return transformIntoDatabaseSession(val);
		});
	}

	public async setSession(databaseSession: DatabaseSession): Promise<void> {
		const value: SessionSchema = {
			SessionID: databaseSession.id,
			UserID: databaseSession.userId,
			ExpiresAt: Math.floor(databaseSession.expiresAt.getTime() / 1000),
			...databaseSession.attributes
		};
		const entries = Object.entries(value).filter(([_, v]) => v !== undefined);
		const columns = entries.map(([k]) => escapeName(k));
		const placeholders = Array(columns.length).fill('?');
		const values = entries.map(([_, v]) => v);
		await this.controller.execute(
			`INSERT INTO ${this.escapedSessionTableName} (${columns.join(
				', '
			)}) VALUES (${placeholders.join(', ')})`,
			values
		);
	}

	public async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
		await this.controller.execute(
			`UPDATE ${this.escapedSessionTableName} SET ${COL_NAMES.session.expires_at} = ? WHERE ${COL_NAMES.session.id} = ?`,
			[Math.floor(expiresAt.getTime() / 1000), sessionId]
		);
	}

	public async deleteExpiredSessions(): Promise<void> {
		await this.controller.execute(
			`DELETE FROM ${this.escapedSessionTableName} WHERE ${COL_NAMES.session.expires_at} <= ?`,
			[Math.floor(Date.now() / 1000)]
		);
	}

	private async getSession(sessionId: string): Promise<DatabaseSession | null> {
		const result = await this.controller.get<SessionSchema>(
			`SELECT * FROM ${this.escapedSessionTableName} WHERE ${COL_NAMES.session.id} = ?`,
			[sessionId]
		);

		if (!result) return null;
		return transformIntoDatabaseSession(result);
	}

	private async getUserFromSessionId(sessionId: string): Promise<DatabaseUser | null> {
		const result = await this.controller.get<UserSchema>(
			`SELECT ${this.escapedUserTableName}.* FROM ${this.escapedSessionTableName} INNER JOIN ${this.escapedUserTableName} ON ${this.escapedUserTableName}.${COL_NAMES.user.id} = ${this.escapedSessionTableName}.${COL_NAMES.session.user_id} WHERE ${this.escapedSessionTableName}.${COL_NAMES.session.id} = ?`,
			[sessionId]
		);

		if (!result) return null;
		return transformIntoDatabaseUser(result);
	}
}

export interface TableNames {
	user: string;
	session: string;
}

export interface Controller {
	execute(sql: string, args: any[]): Promise<void>;
	get<T>(sql: string, args: any[]): Promise<T | null>;
	getAll<T>(sql: string, args: any[]): Promise<T[]>;
}

interface SessionSchema extends RegisteredDatabaseSessionAttributes {
	SessionID: string;
	UserID: string;
	ExpiresAt: number;
}

interface UserSchema extends RegisteredDatabaseUserAttributes {
	UserID: string;
	Username: string;
}

function transformIntoDatabaseSession(raw: SessionSchema): DatabaseSession {
	const { SessionID: id, UserID: userId, ExpiresAt: expiresAtUnix, ...attributes } = raw;
	return {
		userId,
		id,
		expiresAt: new Date(expiresAtUnix * 1000),
		attributes
	};
}

function transformIntoDatabaseUser(raw: UserSchema): DatabaseUser {
	const { UserID: id, ...attributes } = raw;
	return {
		id,
		attributes
	};
}

function escapeName(val: string): string {
	return '`' + val + '`';
}

export class BetterSqlite3Adapter extends SQLiteAdapter {
	constructor(db: Database, tableNames: TableNames) {
		super(new BetterSqlite3Controller(db), tableNames);
	}
}
