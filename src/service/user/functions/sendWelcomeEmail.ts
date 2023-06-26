import { EmailTemplates } from "../../../emails/mjml";
import { ConfirmEmail } from "../../../models/auth/confirm-email.model";
import { UserDocument } from "../../../models/auth/user.model";
import { config } from "../../../config";
import { EmailService } from "../../email/email.service";
import { EmailUtils } from "../../email/email.utils";

export default async function sendWelcomeEmail(
  user: UserDocument
): Promise<boolean> {
  if (!EmailTemplates.newUserWelcomeHtmlEmailTemplate) {
    // logger.info({
    //   message: 'Cannot find email template!',
    // });
    return Promise.resolve(false);
  }

  // populate email template using MJML utils interpolation helper
  let rendered: EmailUtils.RenderedEmailTemplate;

  try {
    const domainStub = config.DOMAIN || "";
    const emailDataObject: ConfirmEmail = {
      email: user.email,
    };

    const signature = EmailUtils.signData(emailDataObject);
    // convert to base 64 for the URL
    const signatureBase64 = Buffer.from(
      signature // default encoding is utf-8
    ).toString("base64");

    const userEmail = encodeURIComponent(user.email);
    const confirmEmailUrl = `${domainStub}/auth/confirm-email?email=${userEmail}&data=${signatureBase64}`;

    rendered = EmailUtils.getRenderedEmailTemplateHtml<'url'>(
      EmailTemplates.newUserWelcomeHtmlEmailTemplate,
      {
        url: confirmEmailUrl,
      }
    );
  } catch (error) {
    // logger.info({
    //   message: 'Error rendering template',
    // });
    return Promise.resolve(false);
  }

  if (rendered.renderedHtml) {
    // send email via sendgrid
    const sent = EmailService.sendMail({
      to: user.email,
      from: config.EMAIL_NOREPLY,
      subject: `Confirm email on ${config.BRAND_NAME}`,
      text: `Welcome to the ${config.BRAND_NAME} website`,
      html: rendered.renderedHtml,
    });
    return Promise.resolve(sent);
  } else {
    // logger.info({
    //   message: 'Email template render issue!',
    // });
    return Promise.resolve(false);
  }
}
