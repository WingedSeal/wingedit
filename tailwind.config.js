/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#FFFFFF', // white
				secondary: '#CCCCCC', // white
				error: '#CC0033', // red
				success: '#16a34a' // green
			}
		}
	},
	plugins: []
};
