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
    (1, 'S', 'DESC-S', 'DESC-S', 'yellow'),
    (2, 'A', 'DESC-A', 'DESC-A', 'purple'),
    (3, 'B', 'DESC-B', 'DESC-C', 'blue'),
    (4, 'C', 'DESC-C', 'DESC-D', 'green');

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
    (5, 4, 'Neural Theft', 'neural_theft'),
    (6, 1, 'Owl Drone', 'owl_drone'),
    (6, 2, 'Shock Bolt', 'shock_bolt'),
    (6, 3, 'Recon Bolt', 'recon_bolt'),
    (6, 4, 'Hunter''s Fury', 'hunters_fury'),
    (7, 1, 'Barrier Orb', 'barrier_orb'),
    (7, 2, 'Slow Orb', 'slow_orb'),
    (7, 3, 'Healing Orb', 'healing_orb'),
    (7, 4, 'Resurrection', 'resurrection'),
    (9, 1, 'Blaze', 'blaze'),
    (9, 2, 'Curveball', 'curveball'),
    (9, 3, 'Hot Hands', 'hot_hands'),
    (9, 4, 'Run It Back', 'run_it_back'),
    (10, 1, 'Cloudburst', 'cloudburst'),
    (10, 2, 'Updraft', 'updraft'),
    (10, 3, 'Tailwind', 'tailwind'),
    (10, 4, 'Blade Storm', 'blade_storm'),
    (11, 1, 'Leer', 'leer'),
    (11, 2, 'Devour', 'devour'),
    (11, 3, 'Dismiss', 'dismiss'),
    (11, 4, 'Empress', 'empress'),
    (12, 1, 'Boom Bot', 'boom_bot'),
    (12, 2, 'Blast Pack', 'blast_pack'),
    (12, 3, 'Paint Shells', 'paint_shells'),
    (12, 4, 'Showstopper', 'showstopper'),
    (13, 1, 'Aftershock', 'aftershock'),
    (13, 2, 'Flashpoint', 'flashpoint'),
    (13, 3, 'Fault Line', 'fault_line'),
    (13, 4, 'Rolling Thunder', 'rolling_thunder'),
    (14, 1, 'Regrowth', 'regrowth'),
    (14, 2, 'Trailblazer', 'trailblazer'),
    (14, 3, 'Guiding Light', 'guiding_light'),
    (14, 4, 'Seekers', 'seekers'),
    (15, 1, 'Fakeout', 'fakeout'),
    (15, 2, 'Blindside', 'blindside'),
    (15, 3, 'Gatecrash', 'gatecrash'),
    (15, 4, 'Dimensional Drift', 'dimensional_drift'),
    (16, 1, 'Gravity Well', 'gravity_well'),
    (16, 2, 'Nova Pulse', 'nova_pulse'),
    (16, 3, 'Nebula', 'nebula'),
    (16, 4, 'Cosmic Divide', 'cosmic_divide'),
    (17, 1, 'FRAG/ment', 'frag_ment'),
    (17, 2, 'FLASH/drive', 'flash_drive'),
    (17, 3, 'ZERO/point', 'zero_point'),
    (17, 4, 'NULL/cmd', 'null_cmd'),
    (18, 1, 'Trademark', 'trademark'),
    (18, 2, 'Headhunter', 'headhunter'),
    (18, 3, 'Rendezvous', 'rendezvous'),
    (18, 4, 'Tour de Force', 'tour_de_force'),
    (19, 1, 'Fast Lane', 'fast_lane'),
    (19, 2, 'Relay Bolt', 'relay_bolt'),
    (19, 3, 'High Gear', 'high_gear'),
    (19, 4, 'Overdrive', 'overdrive'),
    (20, 1, 'Prowler', 'prowler'),
    (20, 2, 'Seize', 'seize'),
    (20, 3, 'Haunt', 'haunt'),
    (20, 4, 'Nightfall', 'nightfall'),
    (21, 1, 'Cascade', 'cascade'),
    (21, 2, 'Cove', 'cove'),
    (21, 3, 'High Tide', 'high_tide'),
    (21, 4, 'Reckoning', 'reckoning'),
    (22, 1, 'Mosh Pit', 'mosh_pit'),
    (22, 2, 'Wingman', 'wingman'),
    (22, 3, 'Dizzy', 'dizzy'),
    (22, 4, 'Thrash', 'thrash'),
    (23, 1, 'GravNet', 'gravnet'),
    (23, 2, 'Sonic Sensor', 'sonic_sensor'),
    (23, 3, 'Barrier Mesh', 'barrier_mesh'),
    (23, 4, 'Annihilation', 'annihilation'),
    (24, 1, 'Contingency', 'contingency'),
    (24, 2, 'Undercut', 'undercut'),
    (24, 3, 'Double Tap', 'double_tab'),
    (24, 4, 'Kill Contract', 'kill_contract'),
    (25, 1, 'Pick Me Up', 'pick_me_up'),
    (25, 2, 'Meddle', 'meddle'),
    (25, 3, 'Ruse', 'ruse'),
    (25, 4, 'Not Dead Yet', 'not_dead_yet'),
    (26, 1, 'Razorvine', 'razorvine'),
    (26, 2, 'Shear', 'shear'),
    (26, 3, 'Arc Rose', 'arc_rose'),
    (26, 4, 'Steel Garden', 'steel_garden');

INSERT INTO
    "Sides" ("ID", "Name")
VALUES
    (0, 'Neutral'),
    (1, 'Attacker'),
    (2, 'Defender');