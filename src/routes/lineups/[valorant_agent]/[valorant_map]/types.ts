export enum ImageType {
	ThrowLineup = 'throw-lineup',
	ThrowGif = 'throw-gif',
	LandSpot = 'land-spot',
	ThrowSpotFirstPerson = 'throw-spot-first-person',
	ThrowSpotThirdPerson = 'throw-spot-third-person'
}

/// Draw circles and lines over the first person image to explain how to line up.
export interface DrawOver {
	main_pixel: [number, number];
	sub_pixels?: [[number, number], [number, number]];
}
