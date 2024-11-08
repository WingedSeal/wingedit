/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#a6e1fa',
				'primary-contrast': '#40679E',
				'primary-dark': '#0b132b',
				'primary-light': '#C0D6E8',
				secondary: '#ffd166',
				'secondary-contrast': '#ff8925',
				'secondary-dark': '#ee7814',
				'secondary-light': '#FFDFC2',
				'plain-light': '#ECDFCC',
				'plain-dark': '#1E201E',
				error: '#FF6D60', // red
				success: '#98D8AA' // green
			}
		}
	},
	plugins: []
};
