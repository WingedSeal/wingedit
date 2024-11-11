/** @type {Object.<string, string>} */
const colors = require('./src/lib/colors');

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors
		}
	},
	plugins: [],
	safelist: Object.keys(colors).flatMap((color) => [`bg-${color}`, `text-${color}`])
};
