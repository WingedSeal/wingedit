INSERT INTO
    "PrivilegeRoles" ("Privilege", "RoleName", "Description")
VALUES
    (
        1,
        'Member',
        'Can add lineups and edit their own lineups.'
    ),
    (
        2,
        'Moderator',
        'Can edit others''s lineups and add agents/maps.'
    ),
    (
        3,
        'Admin',
        'Can directly interact with database.'
    );

INSERT INTO
    "ReferralCodes" ("Code", "Privilege")
VALUES
    ('1234567890123456', 3);