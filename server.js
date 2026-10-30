// Kyzera Production Standalone Server
// Serves the compiled SPA frontend from dist/ and handles Nodemailer SMTP relay endpoints

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.resolve(__dirname, 'dist');

// Read Gmail App Password from .env files or fallback
function getEnvCredentials() {
  const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'src/pages/.env')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const userMatch = content.match(/^GMAIL_USER\s*=\s*(.*)$/m);
      const passMatch = content.match(/^GMAIL_APP_PASSWORD\s*=\s*(.*)$/m);
      const user = userMatch ? userMatch[1].trim() : '';
      const pass = passMatch ? passMatch[1].trim().replace(/\s+/g, '') : '';
      if (user && pass && pass.length >= 8 && pass !== '12345678') {
        return { user, pass };
      }
    }
  }

  return {
    user: process.env.GMAIL_USER || 'thakurhimanshu830@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'sglgmgjhkgizhqof'
  };
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  // 1. GET /api/email-status
  if (req.url === '/api/email-status' && req.method === 'GET') {
    const creds = getEnvCredentials();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      configured: true,
      user: creds.user ? creds.user.replace(/(.{2})(.*)(@.*)/, '$1***$3') : ''
    }));
    return;
  }

  // 2. POST /api/send-otp
  if (req.url === '/api/send-otp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { toEmail, otpCode, studentName } = JSON.parse(body || '{}');
        const creds = getEnvCredentials();
        const user = creds.user;
        const pass = creds.pass;
        const recipient = (toEmail || user).trim();

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user, pass }
        });

        await transporter.sendMail({
          from: `"Kyzera Campus Portal" <${user}>`,
          to: recipient,
          subject: `Your Kyzera Verification OTP: ${otpCode}`,
          html: `<div style="font-family: sans-serif; padding: 20px; background: #0b0f19; color: #f1f5f9; border-radius: 12px;">
            <h2>Kyzera Campus Portal Verification</h2>
            <p>Hello ${studentName || 'Student'}, your one-time verification passcode is:</p>
            <h1 style="color: #60a5fa; letter-spacing: 6px; font-family: monospace;">${otpCode}</h1>
            <p style="color: #94a3b8; font-size: 12px;">Expires in 10 minutes &bull; Single-use only</p>
          </div>`
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: `OTP sent to ${recipient}` }));
      } catch (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 3. POST /api/send-status-email
  if (req.url === '/api/send-status-email' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { toEmail, studentName, ticketId, ticketTitle, newStatus, updatedBy, resolutionNote } = JSON.parse(body || '{}');
        const creds = getEnvCredentials();
        const user = creds.user;
        const pass = creds.pass;
        const recipient = (toEmail || user).trim();

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user, pass }
        });

        await transporter.sendMail({
          from: `"Kyzera Campus Portal" <${user}>`,
          to: recipient,
          subject: `[Kyzera] Ticket #${ticketId} Updated to ${newStatus}`,
          html: `<div style="font-family: sans-serif; padding: 20px; background: #0b0f19; color: #f1f5f9; border-radius: 12px;">
            <h2>Kyzera Grievance Status Update</h2>
            <p>Hello ${studentName || 'Student'},</p>
            <p>Your complaint <strong>#${ticketId}</strong> (<em>${ticketTitle}</em>) has been updated to:</p>
            <h3 style="color: #34d399;">${newStatus}</h3>
            ${resolutionNote ? `<p style="font-style: italic; color: #cbd5e1;">"${resolutionNote}"</p>` : ''}
            <p style="font-size: 12px; color: #94a3b8;">Updated by: ${updatedBy || 'Faculty Committee'}</p>
          </div>`
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: `Status email sent to ${recipient}` }));
      } catch (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 4. Static File Server (Frontend SPA)
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(DIST_DIR, reqPath);
  const ext = path.extname(filePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA Fallback to index.html
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Please run "npm run build" to compile frontend first.');
    }
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Kyzera Production Server running at http://localhost:${PORT}`);
});

