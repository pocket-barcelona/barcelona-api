import * as fs from 'node:fs';
// import { readFileSync } from "fs";
import logger from '../utils/logger.js';

/**
 * ES6 compatible mjml-utils functions, since the mjml-utils library is old and uses require() to be imported
 * @see node_modules/mjml-utils
 */
export namespace AppMJMLUtils {
	/**
	 * Take a compiled template and inject replacement values
	 * @param templatePath The path to the template
	 * @param vars Key-values to be replaces
	 * @returns Interpolated string, or error number
	 */
	export function inject(templatePath: string, vars: Record<string, string>): string {
		if (!templatePath) {
			throw new Error('No template path');
		}
		let file = '';
		try {
			file = fs.readFileSync(templatePath, 'utf-8');
		} catch (error) {
			logger.warn({
				message: 'Error reading file using node.fs',
				error,
			});
			throw new Error('Cannot read file');
		}
		if (!file) {
			logger.warn('Error finding file using node.fs');
			throw new Error('Cannot find template file');
		}

		let finalTemplate = file;

		try {
			Object.keys(vars).forEach((key) => {
				const regex = new RegExp(`{${key}}`, 'g');
				finalTemplate = finalTemplate.replace(regex, vars[key]);
			});
		} catch (_error) {
			throw new Error('Error replacing template keys and values');
		}

		return finalTemplate;
	}

	/**
	 * @todo
	 * Get a list of valid tokens in a template string
	 * @param templatePath
	 * @returns
	 */
	export function introspect(templatePath: string): Record<string, string> {
		if (!templatePath) {
			throw new Error('No template path');
		}
		let file = '';
		try {
			file = fs.readFileSync(templatePath, 'utf-8');
		} catch (error) {
			logger.warn({
				message: 'Error reading file using node.fs',
				error,
			});
			throw new Error('Cannot read file');
		}
		if (!file) {
			logger.warn('Error finding file using node.fs');
			throw new Error('Cannot find template file');
		}

		const tokens = {};

		// inspired by: https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript
		const regExp = /\{\{([^}}]+)\}\}/;
		const matches = regExp.exec(file);
		const thetokens: string[] = [];
		matches?.forEach((m) => {
			if (m.indexOf('\n') === -1) {
				thetokens.push(m);
			}
		});
		console.log(thetokens);

		return tokens;
	}
}
