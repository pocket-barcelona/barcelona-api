import { sendMailHandler } from './functions/index.js';
import type { SendGridMessage } from './functions/sendMail.js';

// biome-ignore lint/complexity/noStaticOnlyClass: N/A
export class EmailService {
	static sendMail = async (message: SendGridMessage, debugMode?: boolean): Promise<boolean> =>
		sendMailHandler(message, debugMode);
}
