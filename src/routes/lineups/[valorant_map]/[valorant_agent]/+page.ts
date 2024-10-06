import { Grade, type LineupInfo, ThrowType } from './Lineup';
export const load = ({ params }) => {
	let lineups: LineupInfo[] = [];

	// temporary place holder
	lineups.push({
		id: 'abcd-1234',
		grade: Grade.A,
		throw_location: 'none',
		land_location: 'none',
		throw_type: ThrowType.Throw,
		has_spot_lineup: false,
		draw_over: { main_pixel: [0, 0] }
	});
	lineups.push({
		id: 'abcd-efgh',
		grade: Grade.C,
		throw_location: 'A MAIN',
		land_location: 'UWU',
		throw_type: ThrowType.Throw,
		has_spot_lineup: false,
		draw_over: { main_pixel: [0, 0] }
	});

	return {
		valorant: {
			map: params.valorant_map,
			agent: params.valorant_agent
		},
		lineups: lineups
	};
};
// const get_image_url = (throw_type: ImageType) => {
// 	return `/api/img/lineup/${params.valorant_map}/${params.valorant_agent}/${throw_type}/${lineup_info.id}`;
// };
// image_url: {
// 	throw_first_person: get_image_url(ImageType.ThrowFirstPerson),
// 	throw_third_person: get_image_url(ImageType.ThrowThirdPerson),
// 	land: get_image_url(ImageType.Land),
// 	spot_lineup: lineup_info.has_spot_lineup ? get_image_url(ImageType.SpotLineup) : null
// }
