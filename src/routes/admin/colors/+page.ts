import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load = dev
	? async ({ parent }) => {
			await parent();
		}
	: async () => {
			error(404, 'Unavaiable in production build.');
		};
