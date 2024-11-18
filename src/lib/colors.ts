const colors = {
	primary: '#A2D2DF',
	'primary-contrast': '#40679E',
	'primary-dark': '#0B132B',
	'primary-light': '#D1E9F6',
	secondary: '#FFD166',
	'secondary-contrast': '#FF8925',
	'secondary-dark': '#EE7814',
	'secondary-light': '#ffeecf',
	'plain-light': '#FEF9F2',
	// 'plain-light': '#FEF9F2',
	'plain-dark': '#1E201E',

	error: '#FF6D60',
	success: '#98D8AA',
	confirm: '#155d27',
	'confirm-hover': '#10451d'

} as const;

export type Color = keyof typeof colors;
export default colors;
