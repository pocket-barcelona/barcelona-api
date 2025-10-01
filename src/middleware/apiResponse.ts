/**
 * @desc This file contain Success and Error response for sending to client / user
 * @inspiredby https://blog.devgenius.io/nodejs-make-your-api-response-nicely-f562f78cb67
 */

type HttpResponseType<T> = {
	data: T;
	error?: boolean;
	message?: string;
	code?: number;
	// biome-ignore lint/suspicious/noExplicitAny: WIP
	meta?: any;
};
interface HttpResponseOptions {
	message?: string | undefined;
	statusCode?: number;
	error?: boolean;
	/** Any additional meta data - e.g. pagination info, count of items etc */
	// biome-ignore lint/suspicious/noExplicitAny: WIP
	meta?: any;
}

/**
 * @desc Send any success response
 *
 */

// biome-ignore lint/suspicious/noExplicitAny: OK
export function success<T = any>(data: T, options?: HttpResponseOptions): any {
	const resp: HttpResponseType<T> = {
		data,
	};
	if (options) {
		if (options.error !== undefined) {
			resp.error = options.error;
		}
		if (options.message !== undefined) {
			resp.message = options.message;
		}
		if (options.statusCode !== undefined && options.statusCode > -1) {
			resp.code = options.statusCode;
		}
		if (options.meta !== undefined) {
			resp.meta = options.meta;
		}
	}

	return resp;
}

/**
 * @desc Send any error response
 * @param {string} message
 * @param {number} statusCode
 * @param {number} proprietaryErrorCode - A special error code for more verbosity
 */
export function error(
	message: string,
	statusCode: number,
	proprietaryErrorCode: string | number = ''
) {
	return {
		message,
		code: statusCode,
		error: true,
		errorCode: proprietaryErrorCode?.toString().length > 0 ? proprietaryErrorCode.toString() : '0',
	};
}

/**
 * @desc Send any validation response
 * @param {object | array} errors
 */
// biome-ignore lint/suspicious/noExplicitAny: WIP
export function validation(errors: any): any {
	return {
		message: 'Validation errors',
		error: true,
		code: 422,
		errors,
	};
}
