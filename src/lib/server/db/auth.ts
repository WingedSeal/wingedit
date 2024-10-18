import { db } from '.';
import type { User } from './types';

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
            "Users" ("UserID", "Username", "HashedPassword") VALUES (
                @UserID, @Username, @HashedPassword
            );`
	).run(user);
};
