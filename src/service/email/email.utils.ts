import bcrypt from 'bcrypt';
import { config } from '../../config.js';
import { AppMJMLUtils } from '../../utils/mjml-utils.js';

export namespace EmailUtils {
	export function signData<T>(anyObject: T, optionalSaltyString = ''): string {
		const str = JSON.stringify(anyObject);
		// use same work factor as passwords
		const salt = bcrypt.genSaltSync(config.saltWorkFactor);
		return bcrypt.hashSync(`${str.toString()}${optionalSaltyString}`, salt);
	}

	export async function compareSignature(
		userDatabasePassword: string,
		candidatePassword: string
	): Promise<boolean> {
		return bcrypt.compare(candidatePassword, userDatabasePassword).catch((_e) => false);
	}

	export function getTemplateTokens(emailTemplate: string): Record<string, string> {
		let tokens: Record<string, string> = {};

		try {
			tokens = AppMJMLUtils.introspect(emailTemplate);
		} catch (_error) {}

		return tokens;
	}

	export type RenderedEmailTemplate = {
		renderedHtml: string;
		error: string | null;
	};

	export function getRenderedEmailTemplateHtml<T = string>(
		emailTemplate: string,
		variables?: Record<T extends string ? T : string, string>
	): RenderedEmailTemplate {
		let renderedHtml = '';
		try {
			renderedHtml = AppMJMLUtils.inject(emailTemplate, variables || {});
		} catch (error) {
			return {
				renderedHtml: '',
				error:
					// biome-ignore lint/suspicious/noExplicitAny: TODO
					(error as any).message || 'An error occurred injecting html template values',
			};
		}

		return {
			renderedHtml,
			error: null,
		};
		// .then((finalTemplate: string) => {
		//   // finalTemplate is an HTML string containing the template with all occurrences
		//   // of `{foo}` replaced with variables.foo
		//   return finalTemplate;
		// }).catch((e: any) => {
		//   return '';
		// });
	}
}
