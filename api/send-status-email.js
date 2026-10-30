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
    const {
      toEmail,
      studentName,
      ticketId,
      ticketTitle,
      oldStatus,
      newStatus,
      updatedBy,
      resolutionNote
    } = req.body || {};

    const user = (process.env.GMAIL_USER || 'thakurhimanshu830@gmail.com').trim();
    let pass = (process.env.GMAIL_APP_PASSWORD || 'sglgmgjhkgizhqof').trim().replace(/\s+/g, '');

    if (!pass || pass === '12345678' || pass.length < 10) {
      pass = 'sglgmgjhkgizhqof';
    }

    const recipient = (toEmail || user).trim();
    const name = (studentName || 'Student').trim();

    const host = req.headers['x-forwarded-host'] || req.headers.host || 'kyzera.vercel.app';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const appUrl = `${proto}://${host}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    const statusColors = {
      'Submitted': '#3b82f6',
      'Under Review': '#8b5cf6',
      'In Progress': '#f59e0b',
      'Resolved': '#10b981'
    };
    const color = statusColors[newStatus] || '#3b82f6';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Kyzera Complaint Update</title>
      </head>
      <body style="margin: 0; padding: 24px 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
        <div style="max-width: 540px; margin: 0 auto; background: #111726; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
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
                  <div style="font-size: 11px; font-weight: 600; color: #60a5fa; text-transform: uppercase; letter-spacing: 1px;">Official Grievance Resolution Update</div>
                </td>
              </tr>
            </table>
          </div>

          <div style="padding: 28px;">
            <div style="display: inline-block; padding: 4px 10px; border-radius: 6px; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); font-family: monospace; font-size: 11px; color: #60a5fa; margin-bottom: 14px; font-weight: 700;">
              TICKET #${ticketId}
            </div>

            <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.4;">
              ${ticketTitle || 'Campus Grievance'}
            </h2>

            <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
              Hello <strong style="color: #f8fafc;">${name}</strong>,<br/>
              An authorized faculty administrator (<strong style="color: #c084fc;">${updatedBy || 'Faculty Committee'}</strong>) has updated the status of your campus complaint.
            </p>

            <div style="background: #090d16; border: 1px solid #1e293b; border-radius: 14px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; padding-bottom: 6px;">Previous Status</td>
                  <td style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; padding-bottom: 6px; text-align: right;">Current Status</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #94a3b8; font-weight: 600;">${oldStatus || 'Submitted'}</td>
                  <td style="font-size: 15px; font-weight: 800; text-align: right; color: ${color};">
                    ➔ ${newStatus}
                  </td>
                </tr>
              </table>

              ${resolutionNote ? `
                <div style="margin-top: 16px; padding-top: 14px; border-top: 1px dashed #1e293b;">
                  <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Faculty Note:</div>
                  <div style="font-size: 13px; color: #cbd5e1; line-height: 1.5; font-style: italic;">"${resolutionNote}"</div>
                </div>
              ` : ''}
            </div>

            ${newStatus === 'Resolved' ? `
              <div style="background: rgba(16, 185, 129, 0.12); border-radius: 10px; padding: 14px 16px; border-left: 3px solid #10b981; margin-bottom: 22px;">
                <div style="font-size: 12px; font-weight: 700; color: #34d399; margin-bottom: 4px;">
                  ✅ Issue Successfully Resolved
                </div>
                <div style="font-size: 12px; color: #cbd5e1; line-height: 1.4;">
                  Our maintenance and faculty teams have closed this work order. Please visit your dashboard to submit feedback or rate this resolution.
                </div>
              </div>
            ` : ''}

            <div style="text-align: center; margin-top: 24px;">
              <a href="${appUrl}" style="display: inline-block; padding: 12px 24px; border-radius: 10px; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px;">
                View Complaint in Dashboard ➔
              </a>
            </div>
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
      subject: `[Kyzera] Ticket #${ticketId} Updated to ${newStatus}`,
      text: `Hello ${name},\n\nYour complaint #${ticketId} ("${ticketTitle}") has been updated to: ${newStatus} by ${updatedBy}.\n\nCheck your dashboard for details.\n\nBest,\nKyzera Governance Team`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: `Status notification email successfully dispatched to ${recipient}!`,
      messageId: info.messageId
    });
  } catch (err) {
    console.error('Nodemailer send-status-email error on Vercel:', err);
    return res.status(200).json({
      success: false,
      reason: 'SMTP_ERROR',
      error: err.message
    });
  }
}

