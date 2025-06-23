import { IMAGES_PATH } from '$env/static/private';
import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const GET = async ({ params }) => {
	const image_path = path.resolve(IMAGES_PATH, params.file);
	if (!image_path.startsWith(path.resolve(IMAGES_PATH))) {
		error(404, 'Invalid path');
	}
	if (fs.existsSync(image_path)) {
		return new Response(fs.readFileSync(image_path));
	} else {
		error(404, 'Image not found');
	}
};
