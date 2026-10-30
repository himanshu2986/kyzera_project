import React, { useState, useEffect } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  ShieldCheck,
  CheckCircle,
  Building,
  Fingerprint,
  AtSign,
  Clock,
  ArrowRight,
  Lock,
  Sparkles,
  Quote,
  UserPlus,
  LogIn
} from 'lucide-react';

export default function Login() {
  const { navigateTo, setCurrentUser, showToast } = useCampus();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('a.sharma@kyzera.edu');
  const [fullName, setFullName] = useState('Aditya Sharma');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [rollId, setRollId] = useState('2022-CS-041');

  const [isDomainVerified, setIsDomainVerified] = useState(true);
  const [codeSent, setCodeSent] = useState(true);
  const [otp, setOtp] = useState(['8', '4', '2', '9', '1', '7']);
  const [timer, setTimer] = useState(40);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setIsDomainVerified(val.endsWith('@kyzera.edu') || val.endsWith('.edu') || val.includes('@'));
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSendCode = () => {
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid institutional college email address', 'error');
      return;
    }
    setCodeSent(true);
    setTimer(40);
    showToast(`Verification passcode dispatched to ${email}`, 'success');
  };

  const handleAuthSubmit = (e) => {
    e?.preventDefault();
    if (otp.join('').length < 6) {
      showToast('Please enter the 6-digit verification passcode', 'warning');
      return;
    }

    if (authMode === 'register') {
      const newUser = {
        email,
        name: fullName || 'Verified Student',
        role: 'Student',
        anonymousId: `Anonymous Student #CP-${Math.floor(1000 + Math.random() * 9000)}`,
        token: `${Math.floor(1000 + Math.random() * 9000)}-V`,
        department: department || 'Engineering & Sciences',
        rollId: rollId || '2024-REG-01',
        verified: true
      };
      setCurrentUser(newUser);
      showToast(`Account registered and verified for ${email}! Token: ${newUser.anonymousId}`, 'success');
    } else {
      showToast('Authenticated! Identity masked as Anonymous Student #CP-8841', 'success');
    }

    navigateTo('dashboard');
  };

  const handleFastSso = (provider) => {
    showToast(`Authenticated via ${provider}! Zero-Knowledge Token issued.`, 'success');
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Value Proposition Card */}
        <div className="lg:col-span-7 bg-[#101726]/90 border border-[#1f293d] rounded-2xl p-8 lg:p-10 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-400 text-xs font-semibold mb-6">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>CORE REQUIREMENT 1 • VERIFIED INSTITUTIONAL ACCESS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Secure, Anonymous &amp; Accountable Campus Governance.
            </h1>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xl">
              A high-integrity feedback infrastructure guaranteeing student protection, immutable ticket auditing, and rapid administrative intervention.
            </p>

            {/* Feature items */}
            <div className="mt-8 space-y-5">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/70 flex items-center justify-center flex-shrink-0 text-blue-400 shadow-sm">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Exclusive @college.edu Access</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Only active enrolled students, accredited faculty, and university staff can file, monitor, or upvote operational complaints.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/70 flex items-center justify-center flex-shrink-0 text-amber-400 shadow-sm">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Zero-Knowledge Identity Masking</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Submissions display publicly as <span className="text-amber-300 font-mono font-medium">Anonymous Student ID #CP-8841</span>. Peers, professors, and department heads never see your true identity.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/70 flex items-center justify-center flex-shrink-0 text-emerald-400 shadow-sm">
                  <AtSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Strict Privacy Audit Protocol</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Administrative de-anonymization strictly mandates dual-faculty ethics board sign-off and writes directly to immutable audit logs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="mt-8 p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 relative">
            <Quote className="w-6 h-6 text-slate-600 mb-2" />
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "Kyzera eliminated duplicate spam and got our hostel heating fixed in 36 hours. Complete student confidence has returned."
            </p>
            <div className="mt-2 text-xs font-semibold text-slate-400">
              <span className="text-white">Rohan Mehra</span> • Kyzera Student Senate President
            </div>
          </div>
        </div>

        {/* Right Authentication / Login Card */}
        <div className="lg:col-span-5 bg-[#121929] border border-[#1f293d] rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>VERIFIED SSO NODE</span>
              </div>

              {/* Mode Toggle: Sign In vs Register */}
              <div className="flex p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    authMode === 'login'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    authMode === 'register'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              {authMode === 'login' ? 'Sign in with College Email' : 'Register College Account'}
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              {authMode === 'login'
                ? 'Enter your designated college email to receive a secure one-time cryptographic passcode.'
                : 'Register as an accredited student or staff member with your institutional credentials.'}
            </p>

            <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aditya Sharma"
                      className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. CS & Eng"
                        className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Roll / Staff ID
                      </label>
                      <input
                        type="text"
                        value={rollId}
                        onChange={(e) => setRollId(e.target.value)}
                        placeholder="e.g. 2022-CS-041"
                        className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <label htmlFor="email">Institutional Email</label>
                  {isDomainVerified && (
                    <span className="text-emerald-400 flex items-center space-x-1 text-[11px]">
                      <span>Kyzera Domain Verified</span>
                      <CheckCircle className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-mono text-sm">
                    @
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="student.name@kyzera.edu"
                    className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendCode}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
              >
                <span>Send Verification Code</span>
                <span className="text-base leading-none">▷</span>
              </button>

              {/* OTP Input Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>One-Time Security Passcode (OTP)</span>
                  <div className="flex items-center space-x-1 text-[11px] text-amber-400">
                    <Clock className="w-3 h-3" />
                    <span>Resend code in 00:{timer < 10 ? `0${timer}` : timer}</span>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-full h-11 text-center bg-[#0a0e17] border border-slate-700 focus:border-blue-500 rounded-lg text-lg font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  ))}
                </div>

                <p className="text-[11px] text-slate-500 mt-2 flex items-center space-x-1">
                  <span>ⓘ</span>
                  <span>Code delivered to institutional inbox and encrypted push token.</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-glow-sm hover:shadow-glow transition-all flex items-center justify-center space-x-2 mt-4"
              >
                <span>{authMode === 'login' ? 'Verify & Enter Anonymous Portal' : 'Register & Enter Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* SSO Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-[#121929] px-2 text-slate-500">FAST INSTITUTIONAL SSO</span>
              </div>
            </div>

            {/* Fast SSO Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleFastSso('Kyzera Canvas LMS')}
                className="py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center space-x-2"
              >
                <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                  C
                </div>
                <span>Kyzera Canvas LMS</span>
              </button>

              <button
                onClick={() => handleFastSso('Google Workspace Edu')}
                className="py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center space-x-2"
              >
                <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                  G
                </div>
                <span>Google Workspace Edu</span>
              </button>
            </div>
          </div>

          {/* Identity Guarantee Box */}
          <div className="mt-6 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
            <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                IDENTITY GUARANTEE (CHARTER §4.2)
              </p>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Your identity is strictly hidden from other users, professors, and department heads. Protected by Campus Data Charter §4.2.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
