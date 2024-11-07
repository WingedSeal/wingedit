export type Agent = {
	ID: number;
	Name: string;
	RoleID: number;
};

export type AgentRoles = {
	RoleID: number;
	Name: string;
};

export type Grade = {
	ID: number;
	Name: string;
	GradeDescription: number;
	DifficultyDescription: number;
	Color: string;
};

export type AgentRole = {
	RoleID: number;
	Name: string;
};

export type ValorantMap = {
	ID: number;
	Name: string;
};

export type MapPosition = {
	ID: number;
	MapID: number;
	Callout: string;
};

export type Ability = {
	AgentID: number;
	AbilityID: number;
	Name: string;
};

export type Side = {
	ID: number;
	Name: string;
};

export type Lineup = {
	ID?: number;
	AgentID: number;
	AbilityID: number;
	MapID: number;
	ExtraImageCount: number;
	ThrowTypeID: number;
	TimeToLand: number;
	GradeID: number;
	Difficulty: number;
	SideID: number;
	CreatedBy: string | null;
	FromMapPositionID: number;
	ToMapPositionID: number;
	FromX: number;
	FromY: number;
	ToX: number;
	ToY: number;
	DrawOverMainX: number;
	DrawOverMainY: number;
	DrawOverSub1X: number | null;
	DrawOverSub1Y: number | null;
	DrawOverSub2X: number | null;
	DrawOverSub2Y: number | null;
};

export const lineupKeys: (keyof Lineup)[] = [
	'AgentID',
	'AbilityID',
	'MapID',
	'ExtraImageCount',
	'ThrowTypeID',
	'TimeToLand',
	'GradeID',
	'Difficulty',
	'SideID',
	'CreatedBy',
	'FromMapPositionID',
	'ToMapPositionID',
	'FromX',
	'FromY',
	'ToX',
	'ToY',
	'DrawOverMainX',
	'DrawOverMainY',
	'DrawOverSub1X',
	'DrawOverSub1Y',
	'DrawOverSub2X',
	'DrawOverSub2Y'
] as const;

export type ThrowType = {
	ID: number;
	Name: string;
	Description: string;
};

export type GameInfo = {
	agents: {
		[agentID: number]: Agent;
	};
	maps: {
		[mapID: number]: ValorantMap;
	};
	throw_types: {
		[throwTypeID: number]: ThrowType;
	};
	grades: {
		[gradeID: number]: Grade;
	};
	mapPositions: {
		[mapID: number]: {
			[mapPositionID: number]: { IsUsed: boolean } & MapPosition;
		};
	};
	sides: {
		[sideID: number]: Side;
	};
};

export type User = {
	UserID: string;
	Username: string;
	HashedPassword: string;
	Privilege: number;
	ReferredByUserID: string | null;
	CreationTimestamp: number;
};

export type UserInfo = Omit<User, 'HashedPassword'>;

export type Session = {
	SessionID: string;
	ExpiresAt: number;
	UserID: string;
};

export type ReferralCode = {
	Code: string;
	FromUserID: string | null;
	Privilege: number;
};

export type PrivilegeRole = {
	Privilege: number;
	RoleName: string;
	Description: string;
};
