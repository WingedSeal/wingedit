export enum Grade {
	S = 'S',
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D'
}

export enum ImageType {
	ThrowFirstPerson = 'throw1',
	ThrowThirdPerson = 'throw2',
	Land = 'land',
	ThrowGif = 'throwgif',
	SpotLineup = 'spot'
}

export enum ThrowType {
	Throw = 'throw',
	JumpThrow = 'jumpthrow',
	RunThrow = 'runthrow'
}

export type UUID = string;

/// Draw circles and lines over the first person image to explain how to line up.
export interface DrawOver {
	main_pixel: [number, number];
	sub_pixels?: [[number, number], [number, number]];
}

export interface LineupInfo {
	id: UUID;
	grade: Grade;
	throw_location: string;
	land_location: string;
	throw_type: ThrowType;
	has_spot_lineup: boolean;
	draw_over: DrawOver;
}
