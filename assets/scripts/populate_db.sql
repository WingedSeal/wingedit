INSERT INTO
    "Agents" ("ID", "Name", "RoleID")
VALUES
    (1, 'Brimstone', 1),
    (2, 'Viper', 1),
    (3, 'Omen', 1),
    (4, 'Killjoy', 4),
    (5, 'Cypher', 4),
    (6, 'Sova', 3),
    (7, 'Sage', 4),
    (9, 'Phoenix', 2),
    (10, 'Jett', 2),
    (11, 'Reyna', 2),
    (12, 'Raze', 2),
    (13, 'Breach', 3),
    (14, 'Skye', 3),
    (15, 'Yoru', 2),
    (16, 'Astra', 1),
    (17, 'Kayo', 3),
    (18, 'Chamber', 4),
    (19, 'Neon', 2),
    (20, 'Fade', 3),
    (21, 'Harbor', 1),
    (22, 'Gekko', 3),
    (23, 'Deadlock', 4),
    (24, 'Iso', 2),
    (25, 'Clove', 1),
    (26, 'Vsye', 4);

INSERT INTO
    "AgentRoles" ("RoleID", "Name")
VALUES
    (1, 'Controller'),
    (2, 'Duelist'),
    (3, 'Initiator'),
    (4, 'Sentinel');

INSERT INTO
    "Grades" ("ID", "Name", "Description")
VALUES
    (1, 'S', 'DESC-S'),
    (2, 'A', 'DESC-A'),
    (3, 'B', 'DESC-B'),
    (4, 'C', 'DESC-C');

INSERT INTO
    "ThrowTypes" ("ID", "Name", "Description")
VALUES
    (1, 'Throw', 'DESC-THROW'),
    (2, 'Run Throw', 'DESC-RUNTHROW'),
    (3, 'Jump Throw', 'DESC-JUMPTHROW');

INSERT INTO
    "Maps" ("ID", "Name")
VALUES
    (1, 'Bind'),
    (2, 'Haven'),
    (3, 'Split'),
    (4, 'Ascent'),
    (5, 'Icebox'),
    (6, 'Breeze'),
    (7, 'Fracture'),
    (8, 'Pearl'),
    (9, 'Lotus'),
    (10, 'Sunset'),
    (11, 'Abyss');

INSERT INTO
    "Abilities" ("AgentID", "AbilityID", "Name", "NameID")
VALUES
    (1, 1, 'Stim Beacon', 'stim_beacon'),
    (1, 2, 'Incendiary', 'incendiary'),
    (1, 3, 'Sky Smoke', 'sky_smoke'),
    (1, 4, 'Orbital Strike', 'orbital_strike'),
    (2, 1, 'Snake Bite', 'snake_bite'),
    (2, 2, 'Poison Cloud', 'poison_cloud'),
    (2, 3, 'Toxic Screen', 'toxic_screen'),
    (2, 4, 'Viper''s pit', 'vipers_pit'),
    (3, 1, 'Shrouded Step', 'shrouded_step'),
    (3, 2, 'Paranoia', 'paranoia'),
    (3, 3, 'Dark Cover', 'dark cover'),
    (3, 4, 'From the Shadows', 'from_the_shadows'),
    (4, 1, 'Nanoswarm', 'nansworm'),
    (4, 2, 'Alarmbot', 'alarmbot'),
    (4, 3, 'Turret', 'turret'),
    (4, 4, 'Lockdown', 'lockdown'),
    (5, 1, 'Trapwire', 'trapwire'),
    (5, 2, 'Cyber Cage', 'cyber_cage'),
    (5, 3, 'Spycam', 'spycam'),
    (5, 4, 'Neural Theft', 'neural_theft');

INSERT INTO
    "Lineups" (
        'UUID',
        'AgentID',
        'MapID',
        'AbilityID',
        'ExtraImageCount',
        'ThrowTypeID',
        'TimeToLand',
        'GradeID'
    )
VALUES
    (
        '096183a5-e386-4813-9d0a-40b1591879f1',
        1,
        1,
        1,
        0,
        1,
        1.5,
        1
    ),
    (
        '37a15edb-20e5-4b71-b2fa-00b4170256f1',
        1,
        1,
        2,
        0,
        1,
        2.5,
        1
    ),
    (
        'ae29fe30-8f15-4137-8f0d-1ede97be6518',
        1,
        1,
        2,
        0,
        1,
        3.5,
        1
    );