import path from "path";

const resetPasswordHtmlEmailTemplate = path.join(path.resolve(), './src/emails/html/reset-password.html');
const newUserWelcomeHtmlEmailTemplate = path.join(path.resolve(), './src/emails/html/new-user-welcome.html');
// @todo...
const invitationResponseEmailTemplate = path.join(path.resolve(), './src/emails/html/new-user-welcome.html');
/**
 * For previewing emails, the template (see Postman: {{endpoint}}/api/emails/preview?template=invitation-response)
 */
export enum EmailTemplatesEnum {
  ResetPassword = 'reset-password',
  NewUserWelcome = 'new-user-welcome',
}

/**
 * This is a list of all the HTML email templates.
 * Add to this each time we add a new email template
 */
export const EmailTemplates = {
  resetPasswordHtmlEmailTemplate,
  newUserWelcomeHtmlEmailTemplate,
  invitationResponseEmailTemplate,
  // ...
}