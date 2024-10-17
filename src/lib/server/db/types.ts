export type Agent = {
	ID: number;
	Name: string;
	RoleID: number;
};

export type Grade = {
	ID: number;
	Name: string;
	Description: number;
};

export type AgentRole = {
	RoleID: number;
	Name: string;
};

export type ValorantMap = {
	ID: number;
	Name: string;
};

export type Ability = {
	AgentID: number;
	AbilityID: number;
	Name: string;
	NameID: string;
};

export type Lineup = {
	ID?: number;
	AbilityID: number;
	AgentID: number;
	MapID: number;
	ExtraImageCount: number;
	ThrowTypeID: number;
	TimeToLand: number;
	GradeID: number;
	DrawOverMainX: number;
	DrawOverMainY: number;
	DrawOverSub1X?: number;
	DrawOverSub1Y?: number;
	DrawOverSub2X?: number;
	DrawOverSub2Y?: number;
};

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
	abilities: Map<string, Ability>;
	throw_types: {
		[throwTypeID: number]: ThrowType;
	};
	grades: {
		[gradeID: number]: Grade;
	};
};
