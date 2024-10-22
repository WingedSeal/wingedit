INSERT INTO
    MapPositions (ID, MapID, Callout)
VALUES
    (1, 4, 'THERE');

INSERT INTO
    "Lineups" (
        ID,
        AgentID,
        AbilityID,
        MapID,
        ExtraImageCount,
        ThrowTypeID,
        TimeToLand,
        GradeID,
        CreatedBy,
        FromMapPositionID,
        ToMapPositionID,
        FromX,
        FromY,
        ToX,
        ToY,
        DrawOverMainX,
        DrawOverMainY,
        DrawOverSub1X,
        DrawOverSub1Y,
        DrawOverSub2X,
        DrawOverSub2Y
    )
VALUES
    (
        3,
        17,
        2,
        4,
        -1,
        3,
        2.5,
        2,
        null,
        1,
        1,
        0,
        0,
        0,
        0,
        50,
        50,
        null,
        null,
        null,
        null
    )