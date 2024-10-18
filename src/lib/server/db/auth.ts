import { db } from '.';
import type { User } from './types';
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
