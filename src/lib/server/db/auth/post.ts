import { db } from '..';
import type { ReferralCode, User, Session } from '../types';

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
	),
	addSession: db.prepare(
		`
INSERT INTO
"Sessions" ("SessionID", "ExpiresAt", "UserID") VALUES (
	@SessionID, @ExpiresAt, @UserID
);`
	),
	deleteSession: db.prepare(
		`
DELETE FROM
	"Sessions" 
WHERE
	"SessionID" = ?);`
	),
	resetSession: db.prepare(
		`
UPDATE 
	"Sessions" 
SET 
	ExpiresAt = @expiresAt 
WHERE 
	SessionID = @sessionID;`
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

export const addSession = (session: Session) => {
	statements.addSession.run(session);
};

export const deleteSession = (sessionID: string) => {
	statements.deleteSession.run(sessionID);
};

export const resetSession = (expiresAt: number, sessionID: string) => {
	statements.resetSession.run({ expiresAt, sessionID });
};
