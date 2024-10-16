export type Agent = {
	ID: number;
	Name: string;
	RoleID: number;
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
	UUID?: string;
	AbilityID: number;
	MapID: number;
	ExtraImageCount: number;
	ThrowTypeID: number;
	TimeToLand: number;
};

export type ThrowType = {
	ID: number;
	Name: string;
	Description: string;
};
