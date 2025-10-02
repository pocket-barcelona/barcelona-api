import bcrypt from 'bcrypt';
import { config } from '../../config.js';

export namespace UserUtils {
	export async function generateHashedPassword(rawPassword: string): Promise<string> {
		// hash the password using bcrypt
		const salt = await bcrypt.genSalt(config.saltWorkFactor);
		const hash = bcrypt.hashSync(rawPassword.toString(), salt);
		return hash;
	}

	export async function comparePassword(
		userDatabasePassword: string,
		candidatePassword: string
	): Promise<boolean> {
		return bcrypt.compare(candidatePassword, userDatabasePassword).catch((_error) => false);
	}

	export const generateResetPasswordUrl = (email: string, token: string): string => {
		// @todo - email link!
		const domainStub = config.DOMAIN || '';

		// create a base 64 encoded string of "token=TOKEN&email=EMAIL"
		// could just append url params, but it looks a bit cleaner this way
		const dataToEncode = `token=${token}&email=${email}`;
		const encodedData = Buffer.from(
			dataToEncode // default encoding is utf-8
		).toString('base64');

		// resetUrl.searchParams.set('email', email);
		// resetUrl.searchParams.set('token', token);
		// resetUrl.searchParams.set('data', encodedData);

		const resetUrl = new URL(`${domainStub}/auth/reset-password/${encodedData}`);
		return resetUrl.toString();
	};
}
