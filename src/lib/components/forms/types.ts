export type DataType = {
	lineupForm: SuperValidated<Infer<typeof lineupSchema>, string, Infer<typeof lineupSchema>>;
	mapPositionForm: SuperValidated<
		Infer<typeof mapPositionSchema>,
		{ message: string; newMapPosition: MapPosition; mapID: number },
		Infer<typeof mapPositionSchema>
	>;
	mapPositionDeleteForm: SuperValidated<
		Infer<typeof mapPositionDeleteSchema>,
		{ message: string; deletedMapPosition: MapPosition },
		Infer<typeof mapPositionDeleteSchema>
	>;
	gameInfo: GameInfo;
	abilities: ReturnType<typeof getAbilities>;
};
