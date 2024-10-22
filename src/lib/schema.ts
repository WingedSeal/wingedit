import { z } from 'zod';
import sizeOf from 'image-size';

export const inviteSchema = z.object({
	privilege: z.number().int().default(1),
	isHideSource: z.boolean()
});

export const signinSchema = z.object({
	username: z
		.string()
		.min(4)
		.max(32)
		.regex(/^[a-zA-Z0-9_-]+$/)
		.trim(),
	password: z.string().min(4).max(255).trim()
});

export const signupSChema = z
	.object({
		username: z
			.string()
			.min(4)
			.max(32)
			.regex(/^[a-zA-Z0-9_-]+$/)
			.trim(),
		password: z.string().min(4).max(255).trim(),
		confirmPassword: z.string().min(4).max(255).trim(),
		referralCode: z.string().length(16).trim()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export const agentSchema = z.object({
	agentID: z.number().int(),
	agentName: z.string().min(1).max(16).trim(),
	agentRole: z.number().int().min(1).max(4),
	abilities: z
		.object({
			abilityName: z.string().min(1).max(16).trim(),
			abilityNameID: z.string().min(1).max(16).trim()
		})
		.array()
});

const imageSchema = z
	.instanceof(File, { message: 'Please upload a file.' })
	.refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.')
	.refine((f) => f.name && f.size != 0, 'Please upload a file.')
	.refine(
		(f) => f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/webp',
		'Please upload an image.'
	)
	.refine(async (f) => {
		const size = sizeOf(new Uint8Array(await f.arrayBuffer()));
		return size.width && size.height && size.width * 9 === size.height * 16 && size.width >= 1980;
	}, `Please upload 1980x1080 image.`);

const gifSchema = z
	.instanceof(File, { message: 'Please upload a file.' })
	.refine((f) => f.size < 20_000_000, 'Max 20 MB upload size.')
	.refine((f) => f.name && f.size != 0, 'Please upload a file.')
	.refine((f) => f.type === 'image/gif', 'Please upload a GIF.')
	.refine(async (f) => {
		const size = sizeOf(new Uint8Array(await f.arrayBuffer()));
		// return size.width === 1980 && size.height === 1080;
		return size.width && size.height && size.width * 9 === size.height * 16 && size.width >= 1980;
	}, 'Please upload 1980x1080 gif.');

const decimalSchema = z
	.number({ message: 'Expected a number.' })
	.positive()
	.max(100)
	.refine((x) => x * 100 - Math.trunc(x * 100) < Number.EPSILON, 'Expected up to 2 decimal points.')
	.default(null as unknown as number);

export const lineupSchema = z
	.object({
		agent: z.number().int().min(1, 'Please select an agent.'),
		map: z.number().int().min(1, 'Please select a map.'),
		ability: z.number().int().min(1, 'Please select an agent ability.'),
		throwLineup: imageSchema,
		throwGif: gifSchema,
		landSpot: imageSchema,
		throwSpotFirstPerson: imageSchema,
		throwSpotThirdPerson: imageSchema,
		grade: z.number().int().min(1, 'Please select a grade.'),
		throwType: z.number().int().min(1, 'Please select a throw type.'),
		timeToLand: z
			.number({ message: 'Expected a number.' })
			.positive()
			.max(300)
			.refine(
				(x) => x * 100 - Math.trunc(x * 100) < Number.EPSILON,
				'Expected up to 2 decimal points.'
			)
			.default('' as unknown as number),
		description: z.string().trim(),
		mainX: decimalSchema.default(50),
		mainY: decimalSchema.default(50),
		sub1X: decimalSchema.nullable(),
		sub1Y: decimalSchema.nullable(),
		sub2X: decimalSchema.nullable(),
		sub2Y: decimalSchema.nullable(),
		from: z.number().int().min(1, 'Please select map position.'),
		to: z.number().int().min(1, 'Please select map position.'),
		fromX: decimalSchema,
		fromY: decimalSchema,
		toX: decimalSchema,
		toY: decimalSchema
	})
	.refine((data) => {
		if ([data.sub1X, data.sub1Y, data.sub2X, data.sub2Y].every((x) => x === null)) {
			return true;
		}
		if ([data.sub1X, data.sub1Y, data.sub2X, data.sub2Y].every((x) => x !== null)) {
			return true;
		}
		return false;
	}, 'sub1X, sub1Y, sub2X, sub2Y must either be all null or all non-null');

export const mapSchema = z.object({
	mapID: z.number().int(),
	mapName: z.string().min(1).max(16).trim()
});
