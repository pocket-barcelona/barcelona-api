import { parse } from 'csv-parse/sync';

export function parserService<T>(fileContent: string, csvHeaders: string[]) {
	// init output
	let records: T[] = [];

	// parse
	try {
		records = parse(fileContent, {
			delimiter: ',',
			columns: csvHeaders,
			skip_empty_lines: true,
		});
	} catch (error) {
		console.error(error);
	}
	return records;
}
