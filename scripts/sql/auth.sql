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
        'fokakruwdvtt6dsz',
        'admin',
        '$argon2id$v=19$m=65536,t=3,p=4$iSoR3HS96HDCC31ijqL71w$MFPu4M5l8g+BOVlv2EzmKSYYBrRP19FOijS5x7QvHCU',
        3,
        null,
        1730718369196
    ),
    (
        'fb7mvnbgwk5gxikh',
        'member',
        '$argon2id$v=19$m=65536,t=3,p=4$Qc/MacxTCTrlRonlZDc+xA$UrKLv0mcorQNxgnb/+XyB8xT/P9hlRU7lKDRx/ez1tU',
        1,
        null,
        1730718534081
    ),
    (
        'pkpwc3vjzfjzsthu',
        'moderator',
        '$argon2id$v=19$m=65536,t=3,p=4$J7239hDuCKPtJy5wiuccHg$ieq6xjwjJDNSOYT+tav2ryFivY0/Hi/ncL5WuZFXWoo',
        2,
        null,
        1730718559466
    );