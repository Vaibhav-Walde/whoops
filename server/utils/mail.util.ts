import logger from "../config/logger.config";
import resend from "../config/mailer.config";

interface SendMailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export const sendMail = async ({ to, subject, html }: Omit<SendMailOptions, "text">) => {
  try {
    await resend.emails.send({
      from: "Draftly <noreply@shivamkumar.work>",
      to,
      subject,
      html: html ?? "",
    });
    logger.success("Mail sent successfully");
  } catch (err) {
    logger.error("Error sending mail " + (err instanceof Error ? err.message : String(err)));
    throw err;
  }
};
