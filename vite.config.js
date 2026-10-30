import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Helper to find Gmail credentials across potential .env locations
function getEnvCredentials() {
  const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'src/pages/.env'),
    path.resolve(process.cwd(), 'src/.env')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const userMatch = content.match(/^GMAIL_USER\s*=\s*(.*)$/m);
      const passMatch = content.match(/^GMAIL_APP_PASSWORD\s*=\s*(.*)$/m);
      const user = userMatch ? userMatch[1].trim() : '';
      const pass = passMatch ? passMatch[1].trim().replace(/\s+/g, '') : '';
      if (user && pass && pass.length >= 8 && pass !== '12345678') {
        return { user, pass, path: envPath };
      }
    }
  }

  return {
    user: 'thakurhimanshu830@gmail.com',
    pass: 'sglgmgjhkgizhqof',
    path: null
  };
}

// Helper to save Gmail credentials into both root .env and src/pages/.env
function saveEnvCredentials(user, pass) {
  const cleanUser = (user || '').trim();
  const cleanPass = (pass || '').trim().replace(/\s+/g, '');

  const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'src/pages/.env')
  ];

  for (const envPath of envPaths) {
    try {
      let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

      if (/^GMAIL_USER=.*$/m.test(content)) {
        content = content.replace(/^GMAIL_USER=.*$/m, `GMAIL_USER=${cleanUser}`);
      } else {
        content += `\nGMAIL_USER=${cleanUser}`;
      }

      if (/^GMAIL_APP_PASSWORD=.*$/m.test(content)) {
        content = content.replace(/^GMAIL_APP_PASSWORD=.*$/m, `GMAIL_APP_PASSWORD=${cleanPass}`);
      } else {
        content += `\nGMAIL_APP_PASSWORD=${cleanPass}`;
      }

      fs.writeFileSync(envPath, content.trim() + '\n', 'utf8');
    } catch (err) {
      console.warn(`Could not write to ${envPath}:`, err.message);
    }
  }

  process.env.GMAIL_USER = cleanUser;
  process.env.GMAIL_APP_PASSWORD = cleanPass;
}

function emailApiPlugin() {
  return {
    name: 'kyzera-email-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 1. GET /api/email-status
        if (req.url === '/api/email-status' && req.method === 'GET') {
          try {
            const creds = getEnvCredentials();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              configured: true,
              user: creds.user ? creds.user.replace(/(.{2})(.*)(@.*)/, '$1***$3') : ''
            }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // 2. POST /api/save-email-config
        if (req.url === '/api/save-email-config' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', () => {
            try {
              const { gmailUser, gmailAppPassword } = JSON.parse(bodyStr || '{}');
              saveEnvCredentials(gmailUser, gmailAppPassword);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: 'Gmail configuration updated in .env' }));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        // 3. POST /api/send-otp
        if (req.url === '/api/send-otp' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(bodyStr || '{}');
              const { toEmail, otpCode, studentName, senderEmail, senderAppPassword } = data;

              const creds = getEnvCredentials();
              const user = (senderEmail && senderEmail.includes('@') ? senderEmail : creds.user || 'thakurhimanshu830@gmail.com').trim();
              let pass = (senderAppPassword && senderAppPassword.length >= 12 ? senderAppPassword : creds.pass).trim().replace(/\s+/g, '');
              
              if (!pass || pass === '12345678' || pass.length < 10) {
                pass = 'sglgmgjhkgizhqof';
              }

              const recipient = (toEmail || 'thakurhimanshu830@gmail.com').trim();
              const name = (studentName || 'Student').trim();

              console.log(`[SMTP Relay] Dispatching verification OTP (${otpCode}) to ${recipient} via ${user}...`);

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
              console.log(`[SMTP Relay] ✅ Email sent to ${recipient}: Message ID ${info.messageId}`);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: true,
                message: `Verification code successfully sent to ${recipient}!`,
                messageId: info.messageId
              }));
            } catch (err) {
              console.error('Nodemailer send error:', err);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: false,
                reason: 'SMTP_ERROR',
                error: err.message
              }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), emailApiPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
