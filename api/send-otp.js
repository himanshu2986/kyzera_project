import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { toEmail, otpCode, studentName, senderEmail, senderAppPassword } = req.body || {};

    const user = (senderEmail || process.env.GMAIL_USER || 'thakurhimanshu830@gmail.com').trim();
    let pass = (senderAppPassword || process.env.GMAIL_APP_PASSWORD || 'sglgmgjhkgizhqof').trim().replace(/\s+/g, '');

    if (!pass || pass === '12345678' || pass.length < 10) {
      pass = 'sglgmgjhkgizhqof';
    }

    const recipient = (toEmail || user).trim();
    const name = (studentName || 'Student').trim();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Kyzera Passcode</title>
      </head>
      <body style="margin: 0; padding: 24px 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
        <div style="max-width: 520px; margin: 0 auto; background: #111726; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          <div style="padding: 28px 28px 20px 28px; background: linear-gradient(180deg, rgba(37,99,235,0.15) 0%, rgba(17,23,38,0) 100%); border-bottom: 1px solid #1e293b;">
            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
              <tr>
                <td style="width: 44px; vertical-align: middle;">
                  <div style="width: 40px; height: 40px; background: #2563eb; border-radius: 10px; text-align: center; line-height: 40px; font-size: 20px;">
                    🛡️
                  </div>
                </td>
                <td style="vertical-align: middle; padding-left: 12px;">
                  <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Kyzera</div>
                  <div style="font-size: 11px; font-weight: 600; color: #60a5fa; text-transform: uppercase; letter-spacing: 1px;">Campus Governance Portal</div>
                </td>
              </tr>
            </table>
          </div>

          <div style="padding: 28px;">
            <h2 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #ffffff;">
              Student Authentication Passcode
            </h2>
            <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
              Hello <strong style="color: #f8fafc;">${name}</strong>,<br/>
              A sign-in request was initiated for your Kyzera Student Portal account. Enter the 6-digit one-time security passcode below to verify your identity:
            </p>

            <div style="background: #090d16; border: 1px solid #2563eb; border-radius: 14px; padding: 22px; text-align: center; margin: 24px 0;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 10px;">
                One-Time Verification Passcode
              </div>
              <div style="font-family: 'SF Mono', Consolas, Monaco, monospace; font-size: 40px; font-weight: 800; letter-spacing: 10px; color: #60a5fa; padding: 8px 16px; display: inline-block;">
                ${otpCode}
              </div>
              <div style="font-size: 12px; color: #f59e0b; margin-top: 10px; font-weight: 500;">
                ⏱️ Expires in 10 minutes &bull; Single-use only
              </div>
            </div>

            <div style="background: rgba(30, 41, 59, 0.6); border-radius: 10px; padding: 14px 16px; border-left: 3px solid #10b981; margin-bottom: 22px;">
              <div style="font-size: 12px; font-weight: 600; color: #34d399; margin-bottom: 4px;">
                🔒 Zero-Knowledge Peer Masking Active
              </div>
              <div style="font-size: 12px; color: #cbd5e1; line-height: 1.4;">
                While your verified status is confirmed, your name and identity remain private and anonymous to student peers on the public campus feed.
              </div>
            </div>

            <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0;">
              If you did not request this verification code, please ignore this email or notify campus security.
            </p>
          </div>

          <div style="padding: 16px 28px; background: #0c111d; border-top: 1px solid #1e293b; text-align: center;">
            <div style="font-size: 11px; color: #475569;">
              &copy; 2026 Kyzera University &bull; Problem Statement 04 Automated Governance
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Kyzera Campus Portal" <${user}>`,
      to: recipient,
      subject: `Your Kyzera Verification OTP: ${otpCode}`,
      text: `Hello ${name},\n\nYour Kyzera verification passcode is: ${otpCode}\n\nValid for 10 minutes.\n\nBest regards,\nKyzera Governance Team`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: `Verification code successfully sent to ${recipient}!`,
      messageId: info.messageId
    });
  } catch (err) {
    console.error('Nodemailer send-otp error on Vercel:', err);
    return res.status(200).json({
      success: false,
      reason: 'SMTP_ERROR',
      error: err.message
    });
  }
}

