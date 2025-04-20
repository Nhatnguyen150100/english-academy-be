"use strict";
import dotenv from "dotenv";
dotenv.config();

const mailConfig = {
  HTML_CONTENT_OTP: (otp) => {
    return `
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" bgcolor="#e9ecef">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                  Your OTP Code
                </h1>
              </td>
            </tr>
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                <p style="margin: 0;">Use the following One-Time Password (OTP) to verify your identity. This code will expire in 3 minutes.</p>
              </td>
            </tr>
            <tr>
              <td align="center" bgcolor="#ffffff" style="padding: 24px;">
                <div style="display: inline-block; background-color: #003366; padding: 16px 32px; color: #ffffff; font-size: 24px; border-radius: 6px; font-weight: bold;">
                  ${otp}
                </div>
              </td>
            </tr>
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf;">
                <p style="margin: 0;">If you didn’t request this, please ignore this email.</p>
                <p style="margin: 0;">Cheers,<br>${process.env.MAIL_SUBJECT}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  },

  HTML_CONTENT_PASSWORD: (password) => {
    return `
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" bgcolor="#e9ecef">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                  Your New Password
                </h1>
              </td>
            </tr>
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                <p style="margin: 0;">You have successfully verified your OTP. Below is your new password:</p>
              </td>
            </tr>
            <tr>
              <td align="center" bgcolor="#ffffff" style="padding: 24px;">
                <div style="display: inline-block; background-color: #28a745; padding: 16px 32px; color: #ffffff; font-size: 20px; border-radius: 6px; font-weight: bold;">
                  ${password}
                </div>
              </td>
            </tr>
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf;">
                <p style="margin: 0;">We recommend changing your password after logging in.</p>
                <p style="margin: 0;">Cheers,<br>${process.env.MAIL_SUBJECT}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  },

  optionMail: {
    MAILER: process.env.MAIL_MAILER,
    HOST: process.env.MAIL_HOST,
    PORT: process.env.MAIL_PORT,
    USERNAME: process.env.MAIL_APP,
    PASSWORD: process.env.MAIL_APP_PASSWORD,
    SUBJECT: process.env.MAIL_SUBJECT,
    ENCRYPTION: process.env.MAIL_ENCRYPTION,
    FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
  },
};

export default mailConfig;
