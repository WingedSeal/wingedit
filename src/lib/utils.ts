export const isEmpty = (obj: Record<string, unknown>) => {
	return Object.keys(obj).length === 0;
};

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const MS_PER_WEEK = 7 * MS_PER_DAY;

const msPerUnit = {
	week: MS_PER_WEEK,
	day: MS_PER_DAY,
	hour: MS_PER_HOUR,
	minute: MS_PER_MINUTE,
	second: MS_PER_SECOND
} as const;

const monthsPerYear = 12;

const getMonthDiff = (date1: Date, date2: Date) => {
	return (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());
};

export const timeAgoString = (timestamp: number) => {
	const timestampNow = Date.now();
	const monthDiff = getMonthDiff(new Date(timestamp), new Date(timestampNow));
	const msDiff = timestampNow - timestamp;

	const yearDiff = Math.floor(monthDiff / monthsPerYear);
	if (yearDiff >= 1) return yearDiff + ' year' + (yearDiff > 1 ? 's' : '') + ' ago';
	if (monthDiff >= 1) return monthDiff + ' mounth' + (monthDiff > 1 ? 's' : '') + ' ago';

	const foundUnit = Object.entries(msPerUnit).find(([_, msPer]) => Math.floor(msDiff / msPer) >= 1);
	if (!foundUnit) return '0 seconds ago';
	const [unit, msPer] = foundUnit;
	const unitDiff = Math.floor(msDiff / msPer);
	return unitDiff + ' ' + unit + (unitDiff > 1 ? 's' : '') + ' ago';
};
