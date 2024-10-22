CREATE TABLE
    IF NOT EXISTS "Agents" (
        "ID" TINYINT NOT NULL,
        "Name" VARCHAR(16) NOT NULL, --UNIQUE
        "RoleID" TINYINT NOT NULL,
        PRIMARY KEY ("ID"),
        CONSTRAINT "FK_AgentRoles_RoleID" FOREIGN KEY ("RoleID") REFERENCES "AgentRoles" ("RoleID") ON DELETE RESTRICT ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS "Maps" (
        "ID" TINYINT NOT NULL,
        "Name" VARCHAR(16) NOT NULL, --UNIQUE
        PRIMARY KEY ("ID")
    );

CREATE TABLE
    IF NOT EXISTS "AgentRoles" (
        "RoleID" TINYINT NOT NULL,
        "Name" VARCHAR(16) NOT NULL, --UNIQUE
        PRIMARY KEY ("RoleID")
    );

CREATE TABLE
    IF NOT EXISTS "Abilities" (
        "AgentID" TINYINT NOT NULL,
        "AbilityID" SMALLINT NOT NULL,
        "Name" VARCHAR(16) NOT NULL, --UNIQUE
        "NameID" VARCHAR(16) NOT NULL, --UNIQUE
        PRIMARY KEY ("AgentID", "AbilityID"),
        CONSTRAINT "FK_Agents_AgentID" FOREIGN KEY ("AgentID") REFERENCES "Agents" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS "MapPositions" (
        "ID" SMALLINT NOT NULL,
        "MapID" TINYINT NOT NULL,
        "Callout" VARCHAR(32) NOT NULL,
        PRIMARY KEY ("ID", "MapID"),
        CONSTRAINT "FK_Maps_MapID" FOREIGN KEY ("MapID") REFERENCES "Maps" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "UQ_Callout_MapID" UNIQUE ("Callout", "MapID")
    );

CREATE TABLE
    IF NOT EXISTS "ThrowTypes" (
        "ID" TINYINT NOT NULL,
        "Name" VARCHAR(32) NOT NULL, --UNIQUE
        "Description" TEXT NOT NULL,
        PRIMARY KEY ("ID")
    );

CREATE TABLE
    IF NOT EXISTS "Grades" (
        "ID" TINYINT NOT NULL,
        "Name" CHAR(1) NOT NULL, --UNIQUE
        "Description" TEXT NOT NULL,
        PRIMARY KEY ("ID")
    );

CREATE TABLE
    IF NOT EXISTS "Lineups" (
        "ID" INTEGER NOT NULL,
        "AgentID" SMALLINT NOT NULL,
        "AbilityID" SMALLINT NOT NULL,
        "MapID" TINYINT NOT NULL,
        "ExtraImageCount" TINYINT NOT NULL DEFAULT 0,
        "ThrowTypeID" TINYINT NOT NULL,
        "TimeToLand" DECIMAL(5, 2) NOT NULL,
        "GradeID" TINYINT NOT NULL,
        "CreatedBy" CHAR(16),
        "fromMapPositionID" SMALLINT NOT NULL,
        "toMapPositionID" SMALLINT NOT NULL,
        "fromX" DECIMAL(5, 2) NOT NULL,
        "fromY" DECIMAL(5, 2) NOT NULL,
        "toX" DECIMAL(5, 2) NOT NULL,
        "toY" DECIMAL(5, 2) NOT NULL,
        "DrawOverMainX" DECIMAL(5, 2) NOT NULL,
        "DrawOverMainY" DECIMAL(5, 2) NOT NULL,
        "DrawOverSub1X" DECIMAL(5, 2),
        "DrawOverSub1Y" DECIMAL(5, 2),
        "DrawOverSub2X" DECIMAL(5, 2),
        "DrawOverSub2Y" DECIMAL(5, 2),
        PRIMARY KEY ("ID"),
        CONSTRAINT "FK_Abilities" FOREIGN KEY ("AgentID", "AbilityID") REFERENCES "Abilities" ("AgentID", "AbilityID") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "FK_Maps_MapID" FOREIGN KEY ("MapID") REFERENCES "Maps" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "FK_ThrowTypes_ThrowTypeID" FOREIGN KEY ("ThrowTypeID") REFERENCES "ThrowTypes" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "FK_Grades_GradeID" FOREIGN KEY ("GradeID") REFERENCES "Grades" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "CON_DrawOverSub" CHECK (
            (
                "DrawOverSub1X" IS NULL
                AND "DrawOverSub1Y" IS NULL
                AND "DrawOverSub2X" IS NULL
                AND "DrawOverSub2Y" IS NULL
            )
            OR (
                "DrawOverSub1X" IS NOT NULL
                AND "DrawOverSub1Y" IS NOT NULL
                AND "DrawOverSub2X" IS NOT NULL
                AND "DrawOverSub2Y" IS NOT NULL
            )
        )
    );

CREATE INDEX "IDX_Lineups_AgentID_MAP_ID" ON "Lineups" ("AgentID", "MapID");

CREATE TABLE
    IF NOT EXISTS "Users" (
        "UserID" CHAR(16) NOT NULL,
        "Username" VARCHAR(32) NOT NULL UNIQUE,
        "HashedPassword" CHAR(32) NOT NULL,
        "Privilege" TINYINT NOT NULL,
        "ReferredByUserID" CHAR(16),
        "CreationTimestamp" INTEGER NOT NULL,
        PRIMARY KEY ("UserID"),
        CONSTRAINT "FK_PrivilegeRoles_Privilege" FOREIGN KEY ("Privilege") REFERENCES "PrivilegeRoles" ("Privilege") ON DELETE RESTRICT ON UPDATE RESTRICT,
        CONSTRAINT "FK_Users_ReferredByUserID" FOREIGN KEY ("ReferredByUserID") REFERENCES "Users" ("UserID") ON DELETE SET NULL ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS "Sessions" (
        "SessionID" CHAR(40) NOT NULL,
        "ExpiresAt" INTEGER NOT NULL,
        "UserID" CHAR(16) NOT NULL,
        PRIMARY KEY ("SessionID"),
        CONSTRAINT "FK_Users_UserID" FOREIGN KEY ("UserID") REFERENCES "Users" ("UserID") ON DELETE CASCADE ON UPDATE RESTRICT
    );

CREATE TABLE
    IF NOT EXISTS "PrivilegeRoles" (
        "Privilege" TINYINT NOT NULL,
        "RoleName" VARCHAR(16) NOT NULL, --UNIQUE
        "Description" TEXT NOT NULL,
        PRIMARY KEY ("Privilege")
    );

CREATE TABLE
    IF NOT EXISTS "ReferralCodes" (
        "Code" CHAR(16) NOT NULL,
        "FromUserID" CHAR(16),
        "Privilege" TINYINT NOT NULL,
        PRIMARY KEY ("Code"),
        CONSTRAINT "FK_Users_UserID" FOREIGN KEY ("FromUserID") REFERENCES "Users" ("UserID") ON DELETE CASCADE ON UPDATE RESTRICT
    );