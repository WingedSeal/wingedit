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

-- INSERT INTO
--     "ReferralCodes" ("Code", "Privilege")
-- VALUES
--     ('1234567890123456', 3);
INSERT INTO
    "Users" (
        "UserID",
        "Username",
        "HashedPassword",
        "Privilege",
        "ReferredByUserID",
        "CreationTimestamp"
    )
VALUES
    (
        'uevnacz7d4s3xvvu',
        'admin',
        '$argon2id$v=19$m=65536,t=2,p=1$vTuTaY2O8RvY+XNZ4o3iVw$MPLV++7MN2sytjHwyQEz2qumzrxeRfQEm9/5nCwxayI',
        3,
        null,
        1729577170737
    );