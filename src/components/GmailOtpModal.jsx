import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, AlertTriangle, Key, ExternalLink, X, Send, ShieldCheck, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { checkEmailConfig, saveEmailConfig, sendOtpEmail } from '../services/emailService';

export default function GmailOtpModal({
  isOpen,
  onClose,
  onConfigSaved,
  initialToEmail = '',
  pendingOtpCode = '',
  onUseDemoOtp
}) {
  const [senderEmail, setSenderEmail] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [status, setStatus] = useState({ configured: false, user: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
      const savedUser = localStorage.getItem('kyzera_gmail_user') || '';
      const savedPass = localStorage.getItem('kyzera_gmail_app_password') || '';
      setSenderEmail(savedUser || initialToEmail || '');
      if (savedPass) setAppPassword(savedPass);
      setFeedback(null);
    }
  }, [isOpen, initialToEmail]);

  const loadStatus = async () => {
    const res = await checkEmailConfig();
    setStatus(res);
  };

  if (!isOpen) return null;

  const handleSaveAndSend = async (e) => {
    e?.preventDefault();
    if (!senderEmail || !appPassword) {
      setFeedback({ type: 'error', message: 'Please enter your Gmail and 16-character Google App Password.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: 'info', message: 'Saving credentials and dispatching OTP email...' });

    try {
      const cleanPass = appPassword.replace(/\s+/g, '');
      await saveEmailConfig({ gmailUser: senderEmail.trim(), gmailAppPassword: cleanPass });

      const recipient = (initialToEmail || senderEmail).trim();
      const otpToSend = pendingOtpCode || Math.floor(100000 + Math.random() * 900000).toString();

      const result = await sendOtpEmail({
        toEmail: recipient,
        otpCode: otpToSend,
        studentName: recipient.split('@')[0]
      });

      setIsSubmitting(false);

      if (result.success) {
        if (onConfigSaved) onConfigSaved({ senderEmail, appPassword: cleanPass, otpCode: otpToSend, recipient });
        onClose();
      } else {
        setFeedback({
          type: 'error',
          message: `Dispatch failed: ${result.message || result.error || 'Please verify your 16-character App Password.'}`
        });
      }
    } catch (err) {
      setIsSubmitting(false);
      setFeedback({ type: 'error', message: err.message || 'Error saving configuration.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-blue-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900/50 via-indigo-900/30 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Deliver OTP to Your Gmail</span>
              </h3>
              <p className="text-xs text-slate-400">
                Google requires a 16-character App Password for SMTP dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Quick Setup Instructions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-slate-300">
            <div className="font-bold text-slate-200 text-xs flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Get your Google App Password (Takes ~30 seconds):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>Open{' '}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 underline hover:text-blue-300 font-semibold inline-flex items-center"
                >
                  myaccount.google.com/apppasswords <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                </a>
              </li>
              <li>Name it <strong>Kyzera</strong> and click <strong>Create</strong>.</li>
              <li>Copy the <strong>16-letter password</strong> and paste below.</li>
            </ol>
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <div className={`p-3 rounded-lg border text-xs flex items-center space-x-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
                : feedback.type === 'info'
                ? 'bg-blue-950/40 border-blue-600/50 text-blue-300'
                : 'bg-red-950/40 border-red-600/50 text-red-300'
            }`}>
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSaveAndSend} className="space-y-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">
                Your Gmail Address:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-[#0a0f1d] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">
                Google 16-Character App Password:
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full bg-[#0a0f1d] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-xs tracking-widest"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Saved securely in <code>.env</code> file (as <code>GMAIL_USER</code> and <code>GMAIL_APP_PASSWORD</code>).
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-glow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Dispatching OTP to your Gmail...'
                  : `Save & Send OTP to ${initialToEmail || senderEmail || 'Gmail'} Now ▷`}
              </span>
            </button>
          </form>

          {/* Quick Demo Bypass Option */}
          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => {
                if (onUseDemoOtp) onUseDemoOtp();
                onClose();
              }}
              className="text-xs text-slate-400 hover:text-amber-300 font-medium inline-flex items-center space-x-1 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Don't have an App Password right now? Use Instant Demo Passcode</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
