const colors = {
	primary: '#A6E1FA',
	'primary-contrast': '#40679E',
	'primary-dark': '#0B132B',
	'primary-light': '#C0D6E8',
	secondary: '#FFD166',
	'secondary-contrast': '#FF8925',
	'secondary-dark': '#EE7814',
	'secondary-light': '#FFDFC2',
	'plain-light': '#ECDFCC',
	'plain-dark': '#1E201E',
	'gray-beb': '#EEEEEE',
	'pastel-blue': '#A2D2DF',
	'human': '#FEF9F2',
	'brick': '#FD8B51',
	'lemon': '#FFEB55',
	error: '#FF6D60',
	success: '#98D8AA'
} as const;

export type Color = keyof typeof colors;
export default colors;
