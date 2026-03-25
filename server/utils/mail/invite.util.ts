import { DocumentUserRole } from "@prisma/client";
import { sendMail } from "../mail.util";

interface SendInviteEmailOptions {
  to: string;
  inviteeName: string;
  documentTitle: string;
  role: DocumentUserRole;
  documentUrl?: string;
}

const roleLabel = (role: DocumentUserRole) => {
  return role === "EDITOR" ? "editor" : "viewer";
};

const roleDescription = (role: DocumentUserRole) => {
  return role === "EDITOR" ? "You can read and edit this document." : "You can read this document.";
};

export const sendInviteEmail = async ({
  to,
  inviteeName,
  documentTitle,
  role,
  documentUrl,
}: SendInviteEmailOptions) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>You've been invited</title>
      </head>
      <body style="margin:0;padding:0;background-color:#09090B;font-family:monospace;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090B;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background-color:#18181B;border:1px solid #27272A;border-radius:8px;overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="padding:32px 40px 24px;border-bottom:1px solid #27272A;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <div style="display:inline-block;background-color:#2563EB;border-radius:6px;padding:6px 8px;margin-bottom:16px;">
                            <span style="color:#ffffff;font-size:14px;font-weight:600;font-family:monospace;">✦ draftly</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h1 style="margin:0;font-size:20px;font-weight:600;color:#FAFAFA;font-family:monospace;">
                            You've been invited to collaborate
                          </h1>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:32px 40px;">
                    <p style="margin:0 0 24px;font-size:14px;color:#A1A1AA;line-height:1.7;font-family:monospace;">
                      Hi ${inviteeName},
                    </p>
                    <p style="margin:0 0 24px;font-size:14px;color:#A1A1AA;line-height:1.7;font-family:monospace;">
                      You've been invited to collaborate on a document.
                    </p>

                    <!-- Document Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090B;border:1px solid #27272A;border-radius:6px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <p style="margin:0 0 4px;font-size:11px;color:#A1A1AA;font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;">Document</p>
                          <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#FAFAFA;font-family:monospace;">${documentTitle}</p>
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background-color:#27272A;border-radius:4px;padding:3px 10px;">
                                <span style="font-size:11px;color:#A1A1AA;font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;">
                                  ${roleLabel(role)}
                                </span>
                              </td>
                            </tr>
                          </table>
                          <p style="margin:12px 0 0;font-size:13px;color:#A1A1AA;font-family:monospace;">
                            ${roleDescription(role)}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA -->
                    ${
                      documentUrl
                        ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td align="center">
                          <a href="${documentUrl}"
                            style="display:inline-block;background-color:#2563EB;color:#ffffff;font-family:monospace;font-size:14px;font-weight:600;text-decoration:none;padding:12px 32px;border-radius:6px;">
                            Open Document →
                          </a>
                        </td>
                      </tr>
                    </table>`
                        : ""
                    }

                    <p style="margin:0;font-size:13px;color:#A1A1AA;line-height:1.7;font-family:monospace;">
                      If you weren't expecting this invite, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;border-top:1px solid #27272A;">
                    <p style="margin:0;font-size:12px;color:#52525B;font-family:monospace;">
                      © ${new Date().getFullYear()} Draftly. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await sendMail({
    to,
    subject: `You've been invited to "${documentTitle}" on Draftly`,
    html,
  });
};
