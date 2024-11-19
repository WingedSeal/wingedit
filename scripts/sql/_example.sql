INSERT INTO
    "MapPositions" ("ID", "MapID", "Callout")
VALUES
    (1, 3, 'A Heaven'),
    (2, 3, 'A Main'),
    (3, 3, 'CT'),
    (4, 3, 'Mid Top'),
    (5, 3, 'B Backsite'),
    (6, 3, 'B Main'),
    (7, 3, 'B Heaven'),
    (8, 3, 'Screen');

INSERT INTO
    "Lineups" (
        "ID",
        "AgentID",
        "AbilityID",
        "MapID",
        "ExtraImageCount",
        "ThrowTypeID",
        "TimeToLand",
        "GradeID",
        "Difficulty",
        "SideID",
        "CreatedBy",
        "FromMapPositionID",
        "ToMapPositionID",
        "FromX",
        "FromY",
        "ToX",
        "ToY",
        "DrawOverMainX",
        "DrawOverMainY",
        "DrawOverSub1X",
        "DrawOverSub1Y",
        "DrawOverSub2X",
        "DrawOverSub2Y",
        "Description"
    )
VALUES
    (
        1,
        17,
        2,
        3,
        0,
        1,
        2.5,
        2,
        4,
        2,
        'q7edhzkh623wxgx7',
        1,
        2,
        30.79,
        71.25,
        47.79,
        83.25,
        50,
        50,
        null,
        null,
        null,
        null,
        ''
    ),
    (
        2,
        17,
        2,
        3,
        0,
        3,
        2.5,
        3,
        3,
        2,
        'q7edhzkh623wxgx7',
        3,
        4,
        21.04,
        47.38,
        40.54,
        50,
        50,
        50,
        47.58,
        50,
        49.92,
        45.42,
        ''
    ),
    (
        3,
        17,
        2,
        3,
        0,
        1,
        2.5,
        3,
        4,
        2,
        'q7edhzkh623wxgx7',
        5,
        6,
        32.29,
        6.88,
        51.16,
        10.5,
        50,
        50,
        null,
        null,
        null,
        null,
        ''
    ),
    (
        4,
        17,
        2,
        3,
        0,
        2,
        2.5,
        1,
        4,
        2,
        'q7edhzkh623wxgx7',
        7,
        5,
        46.16,
        30.38,
        29.66,
        9.88,
        50,
        50,
        null,
        null,
        null,
        null,
        ''
    ),
    (
        5,
        17,
        2,
        3,
        0,
        1,
        2.5,
        2,
        4,
        2,
        'q7edhzkh623wxgx7',
        3,
        8,
        21.04,
        57.63,
        21.41,
        78.25,
        50,
        50,
        42.58,
        50,
        42.58,
        50,
        ''
    );