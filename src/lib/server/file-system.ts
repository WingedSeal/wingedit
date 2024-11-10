import { IMAGES_PATH } from '$env/static/private';
import path from 'path';
import sharp from 'sharp';

export const writeWebp = async (file: File | null, fileName: string, size: [number, number]) => {
	if (file === null) return;
	const buffer = await file.arrayBuffer();
	sharp(buffer)
		.resize(...size)
		.webp({ minSize: true, effort: 6 })
		.toFile(path.join(IMAGES_PATH, fileName));
};

export const writeWebpNoResize = async (file: File | null, fileName: string) => {
	if (file === null) return;
	const buffer = await file.arrayBuffer();
	sharp(buffer).webp({ minSize: true, effort: 6 }).toFile(path.join(IMAGES_PATH, fileName));
};

export const writeWebpAnimated = async (
	file: File | null,
	fileName: string,
	size: [number, number]
) => {
	if (file === null) return;
	const buffer = await file.arrayBuffer();
	sharp(buffer, { animated: true })
		.resize(...size)
		.webp({ minSize: true, effort: 6 })
		.toFile(path.join(IMAGES_PATH, fileName));
};

export const FULL_HD: [number, number] = [1920, 1080];
export const SQUARE: [number, number] = [512, 512];
