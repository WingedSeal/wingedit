import { IMAGES_PATH } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import fs from 'fs';
import { Jimp } from 'jimp';
import path from 'path';

// image/jpeg
// image/png
// image/gif

export const actions = {
	upload: async ({ request }) => {
		const data = await request.formData();
		const file = data.get('file-upload') as File;
		if (!file.name) return fail(500, { error: true, message: 'No files were given.' });
		if (file.type == 'image/jpeg') {
			fs.writeFile(
				path.join(IMAGES_PATH, 'test.jpg'),
				new Uint8Array(await file.arrayBuffer()),
				() => {}
			);
			return { success: true };
		} else if (file.type == 'image/png') {
			const image = await Jimp.read(await file.arrayBuffer());
			image.write(`${path.join(IMAGES_PATH, 'test')}.jpg`);
		} else {
			return fail(500, { error: true, message: 'Given file was not an image.' });
		}
		return { success: true };
	}
};
