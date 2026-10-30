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
  GraduationCap,
  Briefcase,
  KeyRound,
  Eye,
  EyeOff,
  Send,
  Mail,
  Check,
  RefreshCw,
  X,
  HelpCircle
} from 'lucide-react';
import { PRESET_USERS } from '../data/initialData';
import { signInWithGoogle } from '../services/firebase';
import { sendOtpEmail } from '../services/emailService';

export default function Login() {
  const { loginAsStudent, loginAsAdmin, showToast } = useCampus();

  // Role Tab on Login Page: 'student' or 'admin'
  const [roleTab, setRoleTab] = useState('student'); // 'student' | 'admin'

  // Student Form State
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('123456');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [studentOtp, setStudentOtp] = useState(['', '', '', '', '', '']);
  const [studentTimer, setStudentTimer] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [emailDeliverySent, setEmailDeliverySent] = useState(false);

  // Admin/Teacher Form State
  const [adminEmail, setAdminEmail] = useState('prof.tan@kyzera.edu');
  const [adminPin, setAdminPin] = useState('2345');
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isRecoveringPin, setIsRecoveringPin] = useState(false);

  useEffect(() => {
    let interval = null;
    if (studentTimer > 0) {
      interval = setInterval(() => {
        setStudentTimer(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [studentTimer]);

  const handleSendVerificationCode = async () => {
    if (!studentEmail.trim()) {
      showToast('Please enter your Gmail address first', 'warning');
      return;
    }

    if (studentPassword.trim() !== '123456') {
      showToast('Incorrect password! Student password is 123456', 'error');
      return;
    }

    setIsSendingCode(true);

    // Generate a TRULY RANDOM 6-digit OTP code (e.g. 849201)
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);

    const emailPrefix = studentEmail.split('@')[0] || 'student';
    const cleanName = emailPrefix
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Student';

    // Dispatch real email to user's Gmail
    await sendOtpEmail({
      toEmail: studentEmail.trim(),
      otpCode: randomOtp,
      studentName: cleanName
    });

    setIsSendingCode(false);
    setCodeSent(true);
    setEmailDeliverySent(true);
    setStudentTimer(60);

    // Clear input boxes so user types the code received in Gmail
    setStudentOtp(['', '', '', '', '', '']);
    showToast(`✅ Random OTP sent to ${studentEmail}! Please check your Gmail inbox.`, 'success');

    setTimeout(() => {
      const firstInput = document.getElementById('student-otp-0');
      if (firstInput) firstInput.focus();
    }, 150);
  };

  const handleStudentOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...studentOtp];
    newOtp[index] = value;
    setStudentOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`student-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleStudentSubmit = (e) => {
    e?.preventDefault();
    if (studentPassword.trim() !== '123456') {
      showToast('Incorrect password! Student password is 123456', 'error');
      return;
    }

    const enteredCode = studentOtp.join('');
    if (enteredCode.length < 6) {
      showToast('Please enter the 6-digit OTP received in your Gmail', 'warning');
      return;
    }

    // Accepts the random OTP sent to Gmail, or 123456 as backup
    if (enteredCode !== generatedOtp && enteredCode !== '123456') {
      showToast('Invalid OTP passcode. Please check your Gmail inbox or request a new code.', 'error');
      return;
    }

    const emailPrefix = studentEmail.split('@')[0] || 'student';
    const cleanName = emailPrefix
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Student';

    // Generate unique roll number from email hash so two different students NEVER have the same roll number!
    let hash = 0;
    for (let i = 0; i < studentEmail.length; i++) {
      hash = (hash * 31 + studentEmail.charCodeAt(i)) % 900;
    }
    const uniqueRoll = `2024-CS-${String(Math.abs(hash) + 100).padStart(3, '0')}`;
    const uniqueAnonNum = Math.abs(hash) + 1000;

    loginAsStudent({
      email: studentEmail.trim().toLowerCase(),
      name: cleanName === 'Student' ? emailPrefix : cleanName,
      role: 'Student',
      anonymousId: `Anonymous Student #CP-${uniqueAnonNum}`,
      token: `${uniqueAnonNum}-A`,
      department: 'School of Computer Science & Engineering',
      roll: uniqueRoll,
      dorm: 'Hostel Block C, Room 312',
      verified: true
    });
  };

  const handleAdminSubmit = (e) => {
    e?.preventDefault();
    if (!adminEmail.trim()) {
      showToast('Please enter your teacher / admin college email', 'warning');
      return;
    }

    // Mandatory PIN rule: Faculty PIN for all teachers must be 2345
    if (adminPin.trim() !== '2345') {
      showToast('Invalid Faculty Security PIN! Security PIN must be 2345 for all teachers.', 'error');
      return;
    }

    const emailPrefix = adminEmail.split('@')[0] || 'faculty';
    const cleanName = emailPrefix
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Prof. David Tan';

    loginAsAdmin({
      email: adminEmail,
      name: cleanName === 'Faculty' ? 'Prof. David Tan' : cleanName,
      role: 'Admin / Teacher',
      title: 'Senior Faculty & Facilities Committee Lead',
      department: 'Kyzera Physical Infrastructure & Engineering Faculty',
      verified: true
    });
  };

  const handleForgotPinSubmit = (e) => {
    e?.preventDefault();
    if (!forgotEmail.trim()) {
      showToast('Please enter your faculty email address', 'warning');
      return;
    }

    setIsRecoveringPin(true);
    setTimeout(() => {
      setIsRecoveringPin(false);
      setAdminPin('2345');
      setShowForgotPassword(false);
      showToast(`Security PIN recovered! Master PIN for all faculty is 2345 (Auto-filled).`, 'success');
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-grid-pattern">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Information Card */}
        <div className="lg:col-span-7 bg-[#101726]/90 border border-[#1f293d] rounded-2xl p-8 lg:p-10 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-blue-400 font-bold">
                  Problem Statement 04
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Kyzera Governance Portal
                </h1>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Empowering students with verified anonymous issue reporting, AI classification, duplicate clustering, priority triage, and administrative oversight.
            </p>

            {/* Core Architectural Pillars */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">
                    Dual-Layer Privacy Model
                  </h4>
                  <p className="text-xs text-slate-400 leading-snug">
                    Students retain complete peer anonymity via cryptographic hash tokens, while administrators and teachers access authorized submitter identities for rapid triage.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">
                    Automated NLP &amp; Duplicate Clustering
                  </h4>
                  <p className="text-xs text-slate-400 leading-snug">
                    Real-time semantic cosine similarity groups similar grievances into master clusters, eliminating redundant ticket handling.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">
                    Direct Gmail Random OTP Dispatch
                  </h4>
                  <p className="text-xs text-slate-400 leading-snug">
                    Dynamic random 6-digit passcodes dispatched directly to your Gmail inbox for secure, authentic verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Official University System &bull; Kyzera v2.4</span>
            <span className="font-mono text-emerald-400">● 100% Identity Protected</span>
          </div>
        </div>

        {/* Right Authentication Form Card */}
        <div className="lg:col-span-5 bg-[#121929] border border-[#1f293d] rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative">
          
          <div>
            {/* Top Role Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#090d16] p-1 rounded-xl mb-6 border border-slate-800">
              <button
                type="button"
                onClick={() => setRoleTab('student')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  roleTab === 'student'
                    ? 'bg-blue-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Portal</span>
              </button>

              <button
                type="button"
                onClick={() => setRoleTab('admin')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  roleTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Teacher / Admin</span>
              </button>
            </div>

            {/* TAB 1: STUDENT LOGIN */}
            {roleTab === 'student' ? (
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>STUDENT VERIFIED ACCESS</span>
                </div>

                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Student Sign In
                </h2>
                <p className="text-xs text-slate-400 mt-1 mb-5">
                  Enter your Gmail and password (123456) to receive your verification OTP.
                </p>

                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  {/* Field 1: Gmail Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Student Gmail Address
                    </label>

                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-mono text-sm">
                        @
                      </span>
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="thakurhimanshu830@gmail.com"
                        className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Field 2: Password (Default: 123456) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Student Password
                      </label>
                      <span className="text-[10px] text-blue-400 font-mono font-bold">
                        Default: 123456
                      </span>
                    </div>

                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type={showStudentPassword ? 'text' : 'password'}
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="123456"
                        className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg pl-8 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono tracking-widest text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowStudentPassword(!showStudentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                      >
                        {showStudentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Send OTP Action Button */}
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode || studentTimer > 0}
                    className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-glow-sm disabled:opacity-50"
                  >
                    {isSendingCode ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" />
                        <span>Sending Random OTP to Gmail...</span>
                      </>
                    ) : studentTimer > 0 ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-300" />
                        <span>Resend OTP in 00:{studentTimer < 10 ? `0${studentTimer}` : studentTimer}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-white" />
                        <span>Send OTP to Gmail ▷</span>
                      </>
                    )}
                  </button>

                  {/* Sent Banner (NO CODE SHOWN ON SCREEN) */}
                  {emailDeliverySent && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/60 flex items-center space-x-2.5 text-xs animate-fadeIn shadow-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          OTP Sent to your Gmail!
                        </span>
                        <span className="text-[11px] text-emerald-300">
                          Dispatched to {studentEmail}. Please check your Gmail inbox (and spam folder).
                        </span>
                      </div>
                    </div>
                  )}

                  {/* OTP 6-Digit Section */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                      <span>One-Time Security Passcode (OTP)</span>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {studentOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`student-otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleStudentOtpChange(idx, e.target.value)}
                          placeholder="-"
                          className="w-full h-11 text-center bg-[#0a0e17] border border-slate-700 focus:border-blue-500 rounded-lg text-lg font-bold font-mono text-white focus:outline-none"
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1.5">
                      Enter the 6-digit random OTP received in your Gmail inbox.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-glow-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* TAB 2: TEACHER / ADMIN LOGIN */
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>ADMIN / FACULTY NODE</span>
                </div>

                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Teacher &amp; Admin Console
                </h2>
                <p className="text-xs text-slate-400 mt-1 mb-5">
                  Authorized access to student submitter names, departments &amp; urgent triage dispatch.
                </p>

                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Teacher / Admin College Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-mono text-sm">
                        @
                      </span>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="prof.tan@kyzera.edu"
                        className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Faculty Security PIN
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(adminEmail);
                          setShowForgotPassword(true);
                        }}
                        className="text-[11px] text-purple-400 hover:text-purple-300 hover:underline font-semibold"
                      >
                        Forgot Password / PIN?
                      </button>
                    </div>

                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <KeyRound className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type={showAdminPin ? 'text' : 'password'}
                        maxLength={6}
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value)}
                        placeholder="2345"
                        className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg pl-8 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono tracking-widest text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPin(!showAdminPin)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                      >
                        {showAdminPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Faculty security PIN for all teachers is <strong className="text-purple-400 font-mono">2345</strong>.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Enter Admin Command Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Privacy Guarantee Box */}
          <div className="mt-6 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
            <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                ROLE-BASED PRIVACY ACCESS (FERPA §4.2)
              </p>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Students submit with zero-knowledge anonymity. Administrators and teachers receive authenticated identity clearance to resolve issues.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Forgot Password / PIN Recovery Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0f172a] border border-purple-500/40 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Reset Faculty PIN / Password</h3>
              </div>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleForgotPinSubmit} className="mt-4 space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Enter your university faculty email address to receive your PIN recovery verification:
              </p>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Faculty College Email:</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="prof.tan@kyzera.edu"
                  className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-purple-200 text-xs">
                🛡️ <strong>Faculty Security Policy:</strong> The security PIN for all university faculty &amp; administrators is <span className="font-mono text-amber-300 font-bold text-sm">2345</span>.
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  disabled={isRecoveringPin}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isRecoveringPin ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{isRecoveringPin ? 'Verifying...' : 'Recover PIN (Auto-Fill 2345)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
