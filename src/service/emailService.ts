import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { REQUIRED_DOCUMENTS } from '../constant/RequiredDocumentsConst';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function sendWelcomeEmail(to: string, id: string, name: string) {
    const registrationUrl = `${process.env.REGISTRATION_URL || 'https://www.markeduapp.com/registration'}/${id}`;
    const documentList = REQUIRED_DOCUMENTS.map((doc, idx) => `${idx + 1}. ${doc}`).join('<br>');
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Welcome to Mark International',
        html: `
  <div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background:#0f172a;padding:20px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;">
                  Mark International
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:24px;color:#333333;">
                <h2 style="margin-top:0;color:#0f172a;">Welcome 🎉</h2>

                <p style="font-size:15px;line-height:1.6;">
                  Dear <strong>${name}</strong>,
                </p>

                <p style="font-size:15px;line-height:1.6;">
                  Welcome to <strong>Mark International</strong>! We’re excited to have you onboard.
                </p>

                <p style="font-size:15px;line-height:1.6;">
                  <strong>Your ID:</strong> ${id}
                </p>

                <!-- CTA Button -->
                <div style="text-align:center;margin:30px 0;">
                  <a href="${registrationUrl}"
                    style="
                      background:#2563eb;
                      color:#ffffff;
                      text-decoration:none;
                      padding:12px 24px;
                      border-radius:6px;
                      font-size:15px;
                      display:inline-block;
                    ">
                    Complete Registration
                  </a>
                </div>

                <p style="font-size:15px;line-height:1.6;">
                  After completing registration, please upload the following documents:
                </p>

                <div style="
                  background:#f8fafc;
                  border:1px solid #e5e7eb;
                  border-radius:6px;
                  padding:16px;
                  font-size:14px;
                  line-height:1.6;
                ">
                  ${documentList}
                </div>

                <p style="font-size:14px;line-height:1.6;margin-top:24px;">
                  If you have any questions, feel free to reach out to our support team.
                </p>

                <p style="font-size:14px;">
                  Regards,<br/>
                  <strong>Mark International Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f1f5f9;text-align:center;padding:14px;font-size:12px;color:#64748b;">
                © ${new Date().getFullYear()} Mark International. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
`,
    };
    console.log(`[EMAIL] Sending welcome email to: ${to}`);
    try {
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Welcome email sent successfully to: ${to}`);
    } catch (error) {
        console.error(`[EMAIL] Failed to send welcome email to: ${to}`, error);
    }
}
