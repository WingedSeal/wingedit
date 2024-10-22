import { db } from '..';
import type { ReferralCode, User } from '../types';

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
export const addUser = (user: User) => {
	db.prepare(
		`
            INSERT INTO
            "Users" ("UserID", "Username", "HashedPassword", "Privilege", "CreationTimestamp") VALUES (
                @UserID, @Username, @HashedPassword, @Privilege, @CreationTimestamp
            );`
	).run(user);
};
