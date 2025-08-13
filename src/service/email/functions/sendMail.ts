import sendgridMail from '@sendgrid/mail';
import { config } from '../../../config.js';

export interface SendGridMessage {
	to: string;
	from: string;
	subject: string;
	text: string;
	html: string;
}

sendgridMail.setApiKey(config.SENDGRID_API_KEY || '');

/**
 * Send an email using SendGrid
 * @link https://www.npmjs.com/package/@sendgrid/mail
 * @param  {SendGridMessage} message The email data to be sent
 * @param  {boolean} debugMode? If true, no email will be sent. Instead, a console.log of the email
 * @returns Promise<boolean>
 */
export default async function sendMail(
	message: SendGridMessage,
	debugMode?: boolean
): Promise<boolean> {
	// example:
	// const message = {
	//   to: 'test@example.com', // Change to your recipient
	//   from: 'test@example.com', // Change to your verified sender
	//   subject: 'Sending with SendGrid is Fun',
	//   text: 'and easy to do anywhere, even with Node.js',
	//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	// }

	// ES6
	// sendgridMail
	//   .send(message)
	//   .then((response) => {
	//     console.log(response[0].statusCode)
	//     console.log(response[0].headers)
	//   })
	//   .catch((error) => {
	//     console.error(error)
	//   })

	// ES8
	try {
		if (debugMode === true) {
			console.log(message);
		} else {
			await sendgridMail.send(message);
		}
		// console.log('Sent!');
		return true;
	} catch (error: unknown) {
		// logger.info({
		//   message: 'Email template render issue!',
		// });
		console.error(error);
		// if (error.response) {
		//   console.error(error.response.body)
		// }
		return false;
	}
}
