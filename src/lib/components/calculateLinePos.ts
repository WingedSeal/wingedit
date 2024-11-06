export const squareToCircle = (
	fromCenter: [number, number],
	toCenter: [number, number],
	clientSize: [number, number],
	fromRadius: number,
	toRadius: number
): { from: [number, number]; to: [number, number] } => {
	let from: [number, number] = [
		(fromCenter[0] * clientSize[0]) / 100,
		((100 - fromCenter[1]) * clientSize[1]) / 100
	];
	let to: [number, number] = [
		(toCenter[0] * clientSize[0]) / 100,
		((100 - toCenter[1]) * clientSize[1]) / 100
	];

	const dx = from[0] - to[0];
	const dy = from[1] - to[1];
	const length = Math.sqrt(dx * dx + dy * dy);
	const radiusFrom = (fromRadius * clientSize[1]) / 100;
	const radiusTo = (toRadius * clientSize[1]) / 100;
	const abs_dx = Math.abs(dx);
	const abs_dy = Math.abs(dy);
	from[0] -= Math.sign(dx) * (abs_dy > abs_dx ? (radiusFrom * abs_dx) / abs_dy : radiusFrom);
	from[1] -= Math.sign(dy) * (abs_dx > abs_dy ? (radiusFrom * abs_dy) / abs_dx : radiusFrom);

	to[0] += (dx * radiusTo) / length;
	to[1] += (dy * radiusTo) / length;
	return { from, to };
};
