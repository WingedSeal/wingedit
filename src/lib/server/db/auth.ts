import { db } from '.';
import type { PrivilegeRole, ReferralCode, User } from './types';
import { type User as LuciaUser } from 'lucia';

export const isUsernameExist = (username: string) => {
	const isExists = db
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
	return isExists;
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

export const addUser = (user: User) => {
	db.prepare(
		`
            INSERT INTO
            "Users" ("UserID", "Username", "HashedPassword", "Privilege") VALUES (
                @UserID, @Username, @HashedPassword, @Privilege
            );`
	).run(user);
};

export type UserInfo = Omit<LuciaUser, 'id'>;

export const toUserInfo = (user: LuciaUser): UserInfo => {
	const { id, ...attributes } = user;
	return { ...attributes };
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

export const addReferralCode = (referralCode: ReferralCode) => {
	db.prepare(
		`
INSERT INTO
	"ReferralCodes" ("Code", "FromUserID", "Privilege")
VALUES
	(@Code, @FromUserID, @Privilege);`
	).run(referralCode);
};

export const deleteReferralCode = (code: string) => {
	db.prepare(
		`
DELETE FROM
	"ReferralCodes"
WHERE
	"Code"=@code;`
	).run({ code });
};

export const getPrivileges = () => {
	const rows = db.prepare(`SELECT * FROM "PrivilegeRoles";`).all() as PrivilegeRole[];
	let privileges: { [privilege: string]: PrivilegeRole } = {};
	rows.forEach((privilege) => {
		privileges[privilege.Privilege] = privilege;
	});
	return privileges;
};
