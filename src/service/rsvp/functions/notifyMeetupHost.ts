import type { MeetupDocument } from "../../../models/meetup.model";
// import logger from "../../../utils/logger";
import { config } from "../../../config";
import { EmailTemplates } from "../../../emails/mjml";
import { EmailService } from "../../email/email.service";
import { EmailUtils } from "../../email/email.utils";

/**
 * Send an email to the event host when somebody responds to an event invitation
 */
export default async function notifyMeetupHost(
  theEvent: MeetupDocument,
  data: { name: string; response: string; comment: string; hostEmail: string }
): Promise<{
  success: boolean;
  error: string;
}> {
  const DEBUG_MODE = false;

  const { name, response, comment } = data;

  try {
    // direct link to the event
    // like: http://localhost:3000/dashboard/details/9252be9a-daa0-4539-b532-be94f6e7fd63
    const domainStub = config.DOMAIN || "";
    const url = `${domainStub}/dashboard/details/${theEvent.meetupId}`;

    if (!EmailTemplates.invitationResponseEmailTemplate) {
      throw new Error("Cannot find email template!");
    }

    // populate email template
    const rendered = EmailUtils.getRenderedEmailTemplateHtml<
      "name" | "comment" | "response" | "url"
    >(EmailTemplates.invitationResponseEmailTemplate, {
      name,
      response,
      comment,
      url,
    });

    if (rendered.renderedHtml) {
      // send email via sendgrid

      const sent = await EmailService.sendMail(
        {
          to: data.hostEmail,
          from: "noreply@herdcats.io",
          subject: `${data.name} has reponded`,
          text: "View your new reply on Herding Cats",
          html: rendered.renderedHtml,
        },
        DEBUG_MODE
      );

      if (sent) {
        return Promise.resolve({
          success: true,
          error: "",
        });
      }
      throw new Error("Error sending email");
    }
    throw new Error("Email template render issue!");
  } catch (error) {
    if (error instanceof Error) {
      return Promise.resolve({
        success: false,
        error: error.message,
      });
    }
    return Promise.resolve({
      success: false,
      error: "An error occurred when trying to notify the user",
    });
  }
}
