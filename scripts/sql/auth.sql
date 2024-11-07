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
        'q7edhzkh623wxgx7',
        'admin',
        '$argon2id$v=19$m=65536,t=3,p=4$/i44WHdWKfI5GzNn1+y6Pw$gAg2XKQoU5ePTWqovCJhuJSThGR5roS9LMpmndcdlfc',
        3,
        null,
        1730994127411
    ),
    (
        'zx5mmsrqusd7oxc3',
        'moderator',
        '$argon2id$v=19$m=65536,t=3,p=4$cVkHCZOKhSZxWG3jL1WvIQ$In9+SNfMuWLCRV8oMT3vylQvWdwq3wxkP2oN0JXhBxs',
        2,
        null,
        1730995229695
    ),
    (
        'rwdcifg3h53nfrlx',
        'member',
        '$argon2id$v=19$m=65536,t=3,p=4$s6T0Shi7K4CweXba3ceFPw$67x8Sq9dwt1D2Aw08sF+L9WUfYp5GwwAGcWNwGlu6Hs',
        1,
        null,
        1730995250593
    );