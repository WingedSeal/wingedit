import { IMAGES_PATH } from '$env/static/private';
import { getAgents, getMaps } from '$lib/server/db/index.js';
import { type ActionFailure } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import type { PageServerLoad } from './$types';
import { superValidate, fail, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import sizeOf from 'image-size';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(schema)),
		agents: getAgents(),
		maps: getMaps()
	};
};

const _image_schema = z
	.instanceof(File, { message: 'Please upload a file.' })
	.refine((f) => f.size < 10_000_000, 'Max 10 MB upload size.')
	.refine((f) => f.type == 'image/jpeg', 'Please upload a jpeg image.')
	.refine(async (f) => {
		const size = sizeOf(new Uint8Array(await f.arrayBuffer()));
		return size.width == 1080 && size.height == 1980;
	}, 'Please upload 1980x1080 image.');

const schema = z.object({
	agent: z.number().min(1, 'Please select an agent.'),
	map: z.number().min(1, 'Please select a map.'),
	ability: z.number().min(1, 'Please select an agent ability.'),
	throwLineup: _image_schema,
	throwGif: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 20_00_000, 'Max 20 MB upload size.')
		.refine((f) => f.type == 'image/gif', 'Please upload a GIF.')
		.refine(async (f) => {
			const size = sizeOf(new Uint8Array(await f.arrayBuffer()));
			return size.width == 1080 && size.height == 1980;
		}, 'Please upload 1980x1080 gif.'),
	landSpot: _image_schema,
	throwSpotFirstPerson: _image_schema,
	throwSpotThirdPerson: _image_schema,
	grade: z.string().length(1, 'Please select a grade.'),
	throwType: z.string().min(1, 'Please select a throw type.'),
	timeToLand: z
		.number({ message: 'Expected a number.' })
		.positive()
		.default('' as unknown as number),
	description: z.string()
});

type Schema = z.infer<typeof schema>;

export const actions = {
	upload: async ({ request }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		// const data = await request.formData();
		// const file = data.get('throw-lineup') as File;
		// const error = write_file(file, 'test');
		// if (error) return error;
		return message(form, 'Sucess');
	}
};

const write_file = (
	file: File,
	image_name: string
): ActionFailure<{ error: boolean; message: string }> | null => {
	if (!file.name || file.size == 0)
		return fail(500, { error: true, message: 'No files were given.' });
	if (file.type == 'image/jpeg') {
		file.arrayBuffer().then((buffer) => {
			fs.writeFile(path.join(IMAGES_PATH, `${image_name}.jpg`), new Uint8Array(buffer), () => {});
		});
		// } else if (file.type == 'image/png') {
		// 	file.arrayBuffer().then((buffer) => {
		// 		Jimp.read(buffer).then((image) => {
		// 			image.write(`${path.join(IMAGES_PATH, image_name)}.jpg`);
		// 		});
		// 	});
	} else {
		return fail(500, { error: true, message: 'Given file was not an image.' });
	}
	return null;
};

const write_file_gif = (
	file: File,
	gif_name: string
): ActionFailure<{ error: boolean; message: string }> | null => {
	if (!file.name || file.size == 0)
		return fail(500, { error: true, message: 'No files were given.' });
	if (file.type != 'image/gif') {
		return fail(500, { error: true, message: 'Given file was not a gif.' });
	}
	file.arrayBuffer().then((buffer) => {
		fs.writeFile(path.join(IMAGES_PATH, `${gif_name}.gif`), new Uint8Array(buffer), () => {});
	});
	return null;
};
