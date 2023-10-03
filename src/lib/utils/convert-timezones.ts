export function convertTZ(date: string | Date, tzString: string = 'Europe/Warsaw') {
	return (typeof date === 'string' ? new Date(date) : date).toLocaleString('en-GB', {
		timeZone: tzString
	});
}
