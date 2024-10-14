CREATE TABLE
    IF NOT EXISTS "Agents" (
        "ID" TINYINT NOT NULL,
        "Name" VARCHAR(16) NOT NULL UNIQUE,
        "RoleID" TINYINT NOT NULL,
        PRIMARY KEY ("ID"),
        CONSTRAINT "fk_agentroles_roleid" FOREIGN KEY ("RoleID") REFERENCES "AgentRoles" ("RoleID") ON DELETE CASCADE ON UPDATE RESTRICT
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
        "Name" VARCHAR(10) NOT NULL UNIQUE,
        PRIMARY KEY ("RoleID")
    );