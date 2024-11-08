import { PUBLIC_REQUIRE_ALL_IMAGES } from '$env/static/public';
import { z } from 'zod';

export const inviteSchema = z.object({
	privilege: z.number().int().default(1),
	isHideSource: z.boolean()
});

const countDecimals = (value: number) => {
	if (value % 1 != 0) return value.toString().split('.')[1].length;
	return 0;
};

export const signinSchema = z.object({
	username: z
		.string()
		.min(4)
		.max(32)
		.regex(/^[a-zA-Z0-9_-]+$/)
		.trim(),
	password: z.string().min(4).max(255).trim()
});

export const registerSchema = z
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

export const DEFAULT_ABILITY_COUNT = 4;
const defaultAbilities = Array(DEFAULT_ABILITY_COUNT).fill({});
export const agentSchema = z.object({
	agentID: z.number().int(),
	agentName: z.string().min(1).max(16).trim(),
	agentRole: z.number().int().min(1).max(4),
	abilities: z
		.object({
			abilityName: z.string().min(1).max(16).trim()
		})
		.array()
		.default(defaultAbilities)
});

const imageSchema = z
	.instanceof(File, { message: 'Please upload a file.' })
	.refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.')
	.refine((f) => f.name && f.size != 0, 'Please upload a file.')
	.refine(
		(f) => f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/webp',
		'Please upload an image.'
	);

const extraImageSchema = z
	.instanceof(File, { message: 'Please upload a file.' })
	.refine((f) => f.size < 2_000_000, 'Max 2 MB upload size per extra image.')
	.refine((f) => f.name && f.size != 0, 'Please upload a file.')
	.refine(
		(f) => f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/webp',
		'Please upload an image.'
	);

const gifSchema = z
	.instanceof(File, { message: 'Please upload a file.' })
	.refine((f) => f.size < 20_000_000, 'Max 20 MB upload size.')
	.refine((f) => f.name && f.size != 0, 'Please upload a file.')
	.refine((f) => f.type === 'image/gif' || f.type === 'image/webp', 'Please upload a GIF.');

const decimalSchema = z
	.number({ message: 'Expected a number.' })
	.positive()
	.max(100)
	.refine((x) => countDecimals(x) <= 2, 'Expected up to 2 decimal points.')
	.default(null as unknown as number);

export const getLineupSchema = (
	refines: {
		refineImage: (f: File) => Promise<boolean>;
		refineImageError: string;
		refineGif: (f: File) => Promise<boolean>;
		refineGifError: string;
	} | null = null
) => {
	let _imageSchema = refines
		? imageSchema.refine(refines.refineImage, refines.refineImageError)
		: imageSchema;
	let _gifSchema = refines
		? gifSchema.refine(refines.refineGif, refines.refineGifError)
		: gifSchema;
	const require_all_images = PUBLIC_REQUIRE_ALL_IMAGES === 'true';
	const nullableImageSchema = require_all_images ? _imageSchema : _imageSchema.nullable();
	return z
		.object({
			agent: z.number().int().min(1, 'Please select an agent.'),
			map: z.number().int().min(1, 'Please select a map.'),
			ability: z.number().int().min(1, 'Please select an agent ability.'),
			throwLineup: imageSchema,
			throwGif: require_all_images ? _gifSchema : _gifSchema.nullable(),
			landSpot: nullableImageSchema,
			throwSpotFirstPerson: nullableImageSchema,
			throwSpotThirdPerson: nullableImageSchema,
			extraImages: extraImageSchema.array(),
			grade: z.number().int().min(1, 'Please select a grade.'),
			difficulty: z.number().int().min(1, 'Please select a difficulty.'),
			side: z.number().int().min(0, "Please select a lineup's side."),
			throwType: z.number().int().min(1, 'Please select a throw type.'),
			timeToLand: z
				.number({ message: 'Expected a number.' })
				.positive()
				.max(300)
				.refine((x) => countDecimals(x) <= 2, 'Expected up to 2 decimal points.')
				.default(null as unknown as number),
			description: z.string().trim(),
			mainX: decimalSchema.default(50),
			mainY: decimalSchema.default(50),
			sub1X: decimalSchema.nullable(),
			sub1Y: decimalSchema.nullable(),
			sub2X: decimalSchema.nullable(),
			sub2Y: decimalSchema.nullable(),
			from: z
				.number({ message: 'Please select map position.' })
				.int()
				.min(0)
				.default(null as unknown as number),
			to: z
				.number({ message: 'Please select map position.' })
				.int()
				.min(0)
				.default(null as unknown as number),
			fromX: decimalSchema.default(0),
			fromY: decimalSchema.default(0),
			toX: decimalSchema.default(0),
			toY: decimalSchema.default(0)
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
};

export const mapSchema = z.object({
	mapID: z.number().int().min(1),
	mapName: z.string().min(1).max(16).trim()
});

export const mapPositionSchema = z.object({
	mapID: z.number().int().min(1, 'No map was chosen.'),
	callout: z.string().min(1).trim()
});
