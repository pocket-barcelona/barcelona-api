import { sendMailHandler } from './functions';
import type { SendGridMessage } from "./functions/sendMail";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class EmailService {

  static sendMail = async (
    message: SendGridMessage,
    debugMode?: boolean
  ): Promise<boolean> => sendMailHandler(message, debugMode);

}
