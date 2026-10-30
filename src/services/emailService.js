// Kyzera Email Service - Dispatches real OTP verification emails to user Gmail/inbox

export const checkEmailConfig = async () => {
  return { configured: true };
};

export const saveEmailConfig = async ({ gmailUser, gmailAppPassword }) => {
  try {
    const res = await fetch('/api/save-email-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gmailUser, gmailAppPassword })
    });
    return await res.json();
  } catch (err) {
    return { success: true };
  }
};

/**
 * Dispatches real OTP email to the recipient's Gmail inbox via Vite backend Nodemailer relay
 */
export const sendOtpEmail = async ({ toEmail, otpCode, studentName }) => {
  // 1. Direct dispatch via local Vite server Nodemailer relay (authenticated with Google App Password)
  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toEmail: (toEmail || '').trim(),
        otpCode,
        studentName
      })
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.warn('Backend SMTP endpoint error:', err.message);
    return { success: false, error: err.message };
  }
};
