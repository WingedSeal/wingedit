import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

export const load = dev
	? () => {}
	: () => {
			error(404, 'Unavaiable in production build.');
		};
