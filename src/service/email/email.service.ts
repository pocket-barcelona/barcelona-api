import { sendMailHandler } from './functions';
import { SendGridMessage } from "./functions/sendMail";

export class EmailService {

  static sendMail = async (
    message: SendGridMessage,
    debugMode?: boolean
  ): Promise<boolean> => sendMailHandler(message, debugMode);

}
