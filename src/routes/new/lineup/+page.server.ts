import { IMAGES_PATH } from '$env/static/private';
import { getAgents, getMaps } from '$lib/server/db/index.js';
import { fail, type ActionFailure } from '@sveltejs/kit';
import fs from 'fs';
import { Jimp } from 'jimp';
import path from 'path';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	return {
		agents: getAgents(),
		maps: getMaps()
	};
};

export const actions = {
	upload: async ({ request }) => {
		const data = await request.formData();
		const file = data.get('throw-lineup') as File;
		const error = write_file(file, 'test');
		if (error) return error;
		return { success: true };
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
	} else if (file.type == 'image/png') {
		file.arrayBuffer().then((buffer) => {
			Jimp.read(buffer).then((image) => {
				image.write(`${path.join(IMAGES_PATH, image_name)}.jpg`);
			});
		});
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
