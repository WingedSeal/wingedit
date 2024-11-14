import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = dev
	? async ({ parent }) => {
			await parent();
		}
	: async () => {
			error(404, 'Unavaiable in production build.');
		};
