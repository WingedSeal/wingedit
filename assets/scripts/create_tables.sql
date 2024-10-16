CREATE TABLE
    IF NOT EXISTS "Agents" (
        "ID" TINYINT NOT NULL,
        "Name" VARCHAR(16) NOT NULL UNIQUE,
        "RoleID" TINYINT NOT NULL,
        PRIMARY KEY ("ID"),
        CONSTRAINT "FK_AgentRoles_RoleID" FOREIGN KEY ("RoleID") REFERENCES "AgentRoles" ("RoleID") ON DELETE RESTRICT ON UPDATE RESTRICT
    );

CREATE TABLE
    IF NOT EXISTS "Maps" (
        "ID" TINYINT NOT NULL,
        "Name" VARCHAR(16) NOT NULL UNIQUE,
        PRIMARY KEY ("ID")
    );

CREATE TABLE
    IF NOT EXISTS "AgentRoles" (
        "RoleID" TINYINT NOT NULL,
        "Name" VARCHAR(16) NOT NULL UNIQUE,
        PRIMARY KEY ("RoleID")
    );

CREATE TABLE
    IF NOT EXISTS "Lineups" (
        "UUID" VARCHAR(36) NOT NULL,
        "AbilityID" SMALLINT NOT NULL,
        "MapID" TINYINT NOT NULL,
        "ExtraImageCount" TINYINT NOT NULL DEFAULT 0,
        "ThrowTypeID" TINYINT NOT NULL,
        "TimeToLand" DECIMAL(5, 2) NOT NULL,
        PRIMARY KEY ("UUID"),
        CONSTRAINT "FK_Abilities_AbilityID" FOREIGN KEY ("AbilityID") REFERENCES "Abilities" ("AbilityID") ON DELETE RESTRICT ON UPDATE RESTRICT,
        CONSTRAINT "FK_Maps_MapID" FOREIGN KEY ("MapID") REFERENCES "Maps" ("ID") ON DELETE RESTRICT ON UPDATE RESTRICT,
        CONSTRAINT "FK_ThrowTypes_ThrowTypeID" FOREIGN KEY ("ThrowTypeID") REFERENCES "ThrowTypes" ("ID") ON DELETE RESTRICT ON UPDATE RESTRICT
    );

CREATE TABLE
    IF NOT EXISTS "Abilities" (
        "AgentID" TINYINT NOT NULL,
        "AbilityID" SMALLINT NOT NULL,
        "Name" VARCHAR(16) NOT NULL UNIQUE,
        "NameID" VARCHAR(16) NOT NULL UNIQUE,
        PRIMARY KEY ("AgentID", "AbilityID"),
        CONSTRAINT "FK_Agents_AgentID" FOREIGN KEY ("AgentID") REFERENCES "Agents" ("ID") ON DELETE RESTRICT ON UPDATE RESTRICT
    );

CREATE TABLE
    IF NOT EXISTS "MapPositions" (
        "ID" SMALLINT NOT NULL,
        "Callout" VARCHAR(32) NOT NULL,
        "MapID" TINYINT NOT NULL,
        PRIMARY KEY ("ID"),
        CONSTRAINT "FK_Maps_MapID" FOREIGN KEY ("MapID") REFERENCES "Maps" ("ID") ON DELETE RESTRICT ON UPDATE RESTRICT,
        CONSTRAINT "UQ_Callout_MapID" UNIQUE ("Callout", "MapID")
    );

CREATE TABLE
    IF NOT EXISTS "ThrowTypes" (
        "ID" TINYINT NOT NULL,
        "Name" VARCHAR(32) NOT NULL UNIQUE,
        "Description" TEXT NOT NULL,
        PRIMARY KEY ("ID")
    );