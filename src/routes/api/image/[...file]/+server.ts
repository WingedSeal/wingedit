import { IMAGES_PATH } from '$env/static/private';
import fs from 'fs';
import path from 'path';

export const GET = async ({ params }) => {
	return new Response(fs.readFileSync(path.join(IMAGES_PATH, params.file)));
};
