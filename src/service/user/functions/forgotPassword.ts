import { config } from '../../../config.js';
import { EmailTemplates } from '../../../emails/mjml/index.js';
import type { ResetPasswordDocument } from '../../../models/auth/reset-password.model.js';
import type { UserDocument } from '../../../models/auth/user.model.js';
import { EmailService } from '../../email/email.service.js';
import { EmailUtils } from '../../email/email.utils.js';
import { UserUtils } from '../user.utils.js';

/**
 * Returns 1 if everything went ok, else a negative number
 * @todo - make an ENUM for the error number?
 * @param  {ResetPasswordDocument} document
 * @param  {UserDocument} user
 * @returns Promise
 */
export default async function forgotPassword(
	document: ResetPasswordDocument,
	user: UserDocument
): Promise<number> {
	const { email, resetToken } = document;
	const resetLink = UserUtils.generateResetPasswordUrl(email.toString(), resetToken.toString());

	if (!EmailTemplates.resetPasswordHtmlEmailTemplate) {
		// logger.info({
		//   message: 'Cannot find email template!',
		// });
		return Promise.resolve(-1);
	}

	// send to the URL in an email...

	// populate email template using MJML utils interpolation helper
	let renderedTemplate = '';

	try {
		const domainStub = config.DOMAIN || '';
		if (!EmailTemplates.resetPasswordHtmlEmailTemplate) {
			return Promise.resolve(-2);
		}

		const rendered = EmailUtils.getRenderedEmailTemplateHtml(
			EmailTemplates.resetPasswordHtmlEmailTemplate,
			{
				link: resetLink,
				homeUrl: `${domainStub}/`,
				loginUrl: `${domainStub}/auth/login`,
			}
		);

		if (rendered.renderedHtml) {
			renderedTemplate = rendered.renderedHtml;
		}
	} catch (error) {
		// logger.info({
		//   message: 'Error rendering template',
		// });
		return Promise.resolve(-3);
	}

	if (renderedTemplate) {
		// send email via sendgrid
		const sent = await EmailService.sendMail({
			to: user.email,
			from: config.EMAIL_NOREPLY,
			subject: `Reset password on ${config.BRAND_NAME}`,
			text: `Reset your password on the ${config.BRAND_NAME} website`,
			html: renderedTemplate,
		});
		if (sent) {
			return Promise.resolve(1);
		}
		return Promise.resolve(-4);
	}
	// logger.info({
	//   message: 'Email template render issue!',
	// });
	return Promise.resolve(-5);
}
