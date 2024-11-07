import { db } from '..';
import type { User, ReferralCode, PrivilegeRole, Session } from '../types';

const statements = {
	isUsernameExist: db.prepare(
		`
SELECT
    1
FROM
    "Users"
WHERE
    "Username" = @username;`
	),
	getUser: db.prepare(
		`
SELECT
    *
FROM
    "Users"
WHERE
    "Username" = @username
LIMIT
	1;`
	),
	getReferralCodes: db.prepare(
		`
SELECT
    *
FROM
    "ReferralCodes"
WHERE
    "FromUserID" = @userID;`
	),
	getHiddenReferralCodes: db.prepare(
		`
SELECT
    *
FROM
    "ReferralCodes"
WHERE
    "FromUserID" IS NULL;`
	),
	getReferralCode: db.prepare(
		`
SELECT
    *
FROM
    "ReferralCodes"
WHERE
    "Code" = @code;`
	),
	getReferralCodeCount: db.prepare(
		`
SELECT
    COUNT(*)
FROM
    "ReferralCodes"
WHERE
    "FromUserID" = @userID;`
	),
	getPrivileges: db.prepare(`SELECT * FROM "PrivilegeRoles";`),
	getSession: db.prepare(`
SELECT 
	Users.*,
	Session.*
FROM "Session" 
	INNER JOIN "Users" 
	ON Users.UserID = Sessions.UserID 
WHERE 
	Session.UserID = ?;`)
} as const;

export const isUsernameExist = (username: string) => {
	const isExist = statements.isUsernameExist.get({ username }) as boolean;
	return isExist;
};

export const getUser = (username: string) => {
	const user = statements.getUser.get({ username }) as User;
	return user;
};

export const getReferralCodes = (userID: string): ReferralCode[] => {
	const rows = statements.getReferralCodes.all({ userID }) as ReferralCode[];
	return rows;
};

export const getHiddenReferralCodes = (): ReferralCode[] => {
	const rows = statements.getHiddenReferralCodes.all() as ReferralCode[];
	return rows;
};

export const getReferralCode = (code: string): ReferralCode => {
	return statements.getReferralCode.get({ code }) as ReferralCode;
};

export const getSession = (SessionID: string): { Users: User; Sessions: Session } => {
	return statements.getSession.get(SessionID) as { Users: User; Sessions: Session };
};

export const getReferralCodeCount = (userID: string): number => {
	const count = statements.getReferralCodeCount.get({ userID }) as { 'COUNT(*)': number };
	return count['COUNT(*)'];
};

export const getPrivileges = () => {
	const rows = statements.getPrivileges.all() as PrivilegeRole[];
	const privileges: { [privilege: string]: PrivilegeRole } = {};
	rows.forEach((privilege) => {
		privileges[privilege.Privilege] = privilege;
	});
	return privileges;
};
