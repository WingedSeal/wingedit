import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { BetterSqlite3Adapter } from './lucia-adapter';
import { db } from './db';

export const PEPPER = '&XR#&IAB'; // TODO: MOVE TO .env

const adapter = new BetterSqlite3Adapter(db, {
	user: 'Users',
	session: 'Sessions'
});

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			username: attributes.Username
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
	}
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	Username: string;
}
