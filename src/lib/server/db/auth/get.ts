import { db } from '..';
import type { User, ReferralCode, PrivilegeRole } from '../types';

export const isUsernameExist = (username: string) => {
	const isExist = db
		.prepare(
			`
SELECT
    1
FROM
    "Users"
WHERE
    "Username" = @username;`
		)
		.get({ username }) as boolean;
	return isExist;
};

export const getUser = (username: string) => {
	const user = db
		.prepare(
			`
SELECT
    *
FROM
    "Users"
WHERE
    "Username" = @username
LIMIT
	1;`
		)
		.get({ username }) as User;
	return user;
};

export const getReferralCodes = (userID: string): ReferralCode[] => {
	const rows = db
		.prepare(
			`
SELECT
    *
FROM
    "ReferralCodes"
WHERE
    "FromUserID" = @userID;`
		)
		.all({ userID }) as ReferralCode[];
	return rows;
};

export const getHiddenReferralCodes = (): ReferralCode[] => {
	const rows = db
		.prepare(
			`
SELECT
    *
FROM
    "ReferralCodes"
WHERE
    "FromUserID" IS NULL;`
		)
		.all() as ReferralCode[];
	return rows;
};

export const getReferralCode = (code: string): ReferralCode => {
	return db
		.prepare(
			`
SELECT
    *
FROM
    "ReferralCodes"
WHERE
    "Code" = @code;`
		)
		.get({ code }) as ReferralCode;
};

export const getReferralCodeCount = (userID: string): number => {
	const count = db
		.prepare(
			`
SELECT
    COUNT(*)
FROM
    "ReferralCodes"
WHERE
    "FromUserID" = @userID;`
		)
		.get({ userID }) as { 'COUNT(*)': number };
	return count['COUNT(*)'];
};

export const getPrivileges = () => {
	const rows = db.prepare(`SELECT * FROM "PrivilegeRoles";`).all() as PrivilegeRole[];
	const privileges: { [privilege: string]: PrivilegeRole } = {};
	rows.forEach((privilege) => {
		privileges[privilege.Privilege] = privilege;
	});
	return privileges;
};
