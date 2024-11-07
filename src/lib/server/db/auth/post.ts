import { db } from '..';
import type { ReferralCode, User } from '../types';

const statements = {
	addReferralCode: db.prepare(
		`
INSERT INTO
	"ReferralCodes" ("Code", "FromUserID", "Privilege")
VALUES
	(@Code, @FromUserID, @Privilege);`
	),
	deleteReferralCode: db.prepare(
		`
DELETE FROM
	"ReferralCodes"
WHERE
	"Code"=@code;`
	),
	addUser: db.prepare(
		`
INSERT INTO
"Users" ("UserID", "Username", "HashedPassword", "Privilege", "CreationTimestamp") VALUES (
	@UserID, @Username, @HashedPassword, @Privilege, @CreationTimestamp
);`
	)
} as const;

export const addReferralCode = (referralCode: ReferralCode) => {
	statements.addReferralCode.run(referralCode);
};

export const deleteReferralCode = (code: string) => {
	statements.deleteReferralCode.run({ code });
};
export const addUser = (user: User) => {
	statements.addUser.run(user);
};
