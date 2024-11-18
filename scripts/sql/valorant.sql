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
    (26, 'Vyse', 4);

INSERT INTO
    "AgentRoles" ("RoleID", "Name")
VALUES
    (1, 'Controller'),
    (2, 'Duelist'),
    (3, 'Initiator'),
    (4, 'Sentinel');

INSERT INTO
    "Grades" (
        "ID",
        "Name",
        "GradeDescription",
        "DifficultyDescription",
        "Color"
    )
VALUES
    (1, 'S', 'DESC-S', 'DESC-S', '#FFD300'),
    (2, 'A', 'DESC-A', 'DESC-A', '#FF2A22'),
    (3, 'B', 'DESC-B', 'DESC-C', '#00CFFF'),
    (4, 'C', 'DESC-C', 'DESC-D', '#00D300');

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
    "Abilities" ("AgentID", "AbilityID", "Name")
VALUES
    (1, 1, 'Stim Beacon'),
    (1, 2, 'Incendiary'),
    (1, 3, 'Sky Smoke'),
    (1, 4, 'Orbital Strike'),
    (2, 1, 'Snake Bite'),
    (2, 2, 'Poison Cloud'),
    (2, 3, 'Toxic Screen'),
    (2, 4, 'Viper''s pit'),
    (3, 1, 'Shrouded Step'),
    (3, 2, 'Paranoia'),
    (3, 3, 'Dark Cover'),
    (3, 4, 'From the Shadows'),
    (4, 1, 'Nanoswarm'),
    (4, 2, 'Alarmbot'),
    (4, 3, 'Turret'),
    (4, 4, 'Lockdown'),
    (5, 1, 'Trapwire'),
    (5, 2, 'Cyber Cage'),
    (5, 3, 'Spycam'),
    (5, 4, 'Neural Theft'),
    (6, 1, 'Owl Drone'),
    (6, 2, 'Shock Bolt'),
    (6, 3, 'Recon Bolt'),
    (6, 4, 'Hunter''s Fury'),
    (7, 1, 'Barrier Orb'),
    (7, 2, 'Slow Orb'),
    (7, 3, 'Healing Orb'),
    (7, 4, 'Resurrection'),
    (9, 1, 'Blaze'),
    (9, 2, 'Curveball'),
    (9, 3, 'Hot Hands'),
    (9, 4, 'Run It Back'),
    (10, 1, 'Cloudburst'),
    (10, 2, 'Updraft'),
    (10, 3, 'Tailwind'),
    (10, 4, 'Blade Storm'),
    (11, 1, 'Leer'),
    (11, 2, 'Devour'),
    (11, 3, 'Dismiss'),
    (11, 4, 'Empress'),
    (12, 1, 'Boom Bot'),
    (12, 2, 'Blast Pack'),
    (12, 3, 'Paint Shells'),
    (12, 4, 'Showstopper'),
    (13, 1, 'Aftershock'),
    (13, 2, 'Flashpoint'),
    (13, 3, 'Fault Line'),
    (13, 4, 'Rolling Thunder'),
    (14, 1, 'Regrowth'),
    (14, 2, 'Trailblazer'),
    (14, 3, 'Guiding Light'),
    (14, 4, 'Seekers'),
    (15, 1, 'Fakeout'),
    (15, 2, 'Blindside'),
    (15, 3, 'Gatecrash'),
    (15, 4, 'Dimensional Drift'),
    (16, 1, 'Gravity Well'),
    (16, 2, 'Nova Pulse'),
    (16, 3, 'Nebula'),
    (16, 4, 'Cosmic Divide'),
    (17, 1, 'FRAG/ment'),
    (17, 2, 'FLASH/drive'),
    (17, 3, 'ZERO/point'),
    (17, 4, 'NULL/cmd'),
    (18, 1, 'Trademark'),
    (18, 2, 'Headhunter'),
    (18, 3, 'Rendezvous'),
    (18, 4, 'Tour de Force'),
    (19, 1, 'Fast Lane'),
    (19, 2, 'Relay Bolt'),
    (19, 3, 'High Gear'),
    (19, 4, 'Overdrive'),
    (20, 1, 'Prowler'),
    (20, 2, 'Seize'),
    (20, 3, 'Haunt'),
    (20, 4, 'Nightfall'),
    (21, 1, 'Cascade'),
    (21, 2, 'Cove'),
    (21, 3, 'High Tide'),
    (21, 4, 'Reckoning'),
    (22, 1, 'Mosh Pit'),
    (22, 2, 'Wingman'),
    (22, 3, 'Dizzy'),
    (22, 4, 'Thrash'),
    (23, 1, 'GravNet'),
    (23, 2, 'Sonic Sensor'),
    (23, 3, 'Barrier Mesh'),
    (23, 4, 'Annihilation'),
    (24, 1, 'Contingency'),
    (24, 2, 'Undercut'),
    (24, 3, 'Double Tap'),
    (24, 4, 'Kill Contract'),
    (25, 1, 'Pick Me Up'),
    (25, 2, 'Meddle'),
    (25, 3, 'Ruse'),
    (25, 4, 'Not Dead Yet'),
    (26, 1, 'Razorvine'),
    (26, 2, 'Shear'),
    (26, 3, 'Arc Rose'),
    (26, 4, 'Steel Garden');

INSERT INTO
    "Sides" ("ID", "Name")
VALUES
    (0, 'Neutral'),
    (1, 'Attacker'),
    (2, 'Defender');