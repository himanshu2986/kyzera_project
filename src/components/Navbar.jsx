import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  ShieldCheck,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  Lock,
  Layers,
  AlertTriangle,
  CheckCircle2,
  FileText,
  X,
  LogIn,
  Flame,
  Database,
  Mail
} from 'lucide-react';
import FirebaseModal from './FirebaseModal';
import GmailOtpModal from './GmailOtpModal';

export default function Navbar() {
  const {
    isAuthenticated,
    currentPage,
    navigateTo,
    currentUser,
    logout,
    notifications,
    showToast,
    activeStudentsCount,
    activeTeachersCount,
    isFirebaseConnected,
    setIsFirebaseConnected
  } = useCampus();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [showGmailModal, setShowGmailModal] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const isTeacherOrAdmin = currentUser?.role?.includes('Admin') || currentUser?.role?.includes('Teacher');

  // Role-based Nav Links
  const navLinks = isAuthenticated
    ? isTeacherOrAdmin
      ? [
          { id: 'admin', label: 'Admin Command Center' },
          { id: 'privacy-audit', label: 'Privacy Audit' },
          { id: 'home', label: 'Public Portal' },
        ]
      : [
          { id: 'dashboard', label: 'My Dashboard' },
          { id: 'submit', label: 'Submit Complaint' },
          { id: 'home', label: 'Public Feed' },
        ]
    : [
        { id: 'login', label: 'Sign In / Register' },
        { id: 'home', label: 'About Kyzera' }
      ];

  const requirementsList = [
    { num: 1, title: 'Verified Access', desc: 'College email registration, login & prototype OTP verification.', page: 'login' },
    { num: 2, title: 'Complaint Submission', desc: 'Submit complaints or suggestions with description, category, and optional visual evidence.', page: 'submit' },
    { num: 3, title: 'Intelligent Classification', desc: 'Automatic categorization into Infrastructure, Sanitation, Academics, and Student Services.', page: 'submit' },
    { num: 4, title: 'Duplicate Detection', desc: 'Vector semantic cosine similarity grouping 34+ reports to reveal recurring problems.', page: 'duplicate-cluster' },
    { num: 5, title: 'Priority Detection', desc: 'Rule-based and text classification detecting urgent safety, infrastructure & living hazards.', page: 'submit' },
    { num: 6, title: 'Admin Dashboard', desc: 'Submission trends, donut breakdown, recurring clusters, and departmental SLA performance.', page: 'admin' },
    { num: 7, title: 'Status Tracking', desc: 'Track & transition through Submitted, Under Review, In Progress, and Resolved.', page: 'admin' },
    { num: 8, title: 'Privacy and Accountability', desc: 'Students see anonymous tokens; Authorized Teachers/Admins see student names & details.', page: 'privacy-audit' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0a0e17]/95 backdrop-blur-md border-b border-[#1f293d] px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand / Logo */}
          <div 
            onClick={() => navigateTo(isAuthenticated ? (isTeacherOrAdmin ? 'admin' : 'dashboard') : 'login')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#0a0e17] rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  Kyzera
                </span>
              </div>
              <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-0.5">
                Campus Governance Portal
              </span>
            </div>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive =
                currentPage === link.id ||
                (link.id === 'dashboard' && currentPage === 'ticket-detail') ||
                (link.id === 'admin' && currentPage === 'duplicate-cluster');

              return (
                <button
                  key={link.id}
                  onClick={() => navigateTo(link.id)}
                  className={`relative px-3.5 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-blue-600/20 border border-blue-500/40 shadow-glow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Logged in User Profile & Log Out Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 pl-2 pr-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/70 hover:border-blue-500 transition-colors text-xs font-medium text-slate-200"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm ${
                    isTeacherOrAdmin
                      ? 'bg-gradient-to-tr from-purple-500 to-indigo-600'
                      : 'bg-gradient-to-tr from-blue-500 to-cyan-500'
                  }`}>
                    {isTeacherOrAdmin ? 'FA' : 'ST'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="block text-xs font-semibold text-slate-200 leading-tight">
                      {currentUser?.name}
                    </span>
                    <span className={`block text-[10px] font-mono leading-none ${
                      isTeacherOrAdmin ? 'text-purple-400' : 'text-blue-400'
                    }`}>
                      {currentUser?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#101726] border border-slate-700 rounded-xl shadow-2xl z-50 p-3">
                    <div className="px-2 py-2 border-b border-slate-700/60 mb-2">
                      <p className="text-xs font-bold text-white">{currentUser?.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{currentUser?.email}</p>
                      <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                        {currentUser?.role}
                      </div>
                      {!isTeacherOrAdmin && (
                        <p className="text-[10px] text-amber-300 font-mono mt-1.5">
                          Public Mask: {currentUser?.anonymousId}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full text-left p-2 rounded-lg text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* When not logged in: simple Sign In button */
              <button
                onClick={() => navigateTo('login')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile nav bar */}
        <div className="md:hidden flex items-center justify-around mt-2 pt-2 border-t border-slate-800 text-[11px] font-medium text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => navigateTo(link.id)}
              className={`px-2 py-1 rounded ${
                currentPage === link.id ? 'text-blue-400 font-bold bg-blue-900/30' : ''
              }`}
            >
              {link.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </header>

      {/* Problem Statement 04 Requirements Checklist Modal */}
      {showRequirementsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#101726] border border-blue-500/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowRequirementsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Problem Statement 04: Compliance Checklist</h3>
                <p className="text-xs text-slate-400">
                  All 8 Core Requirements from the hackathon problem statement fully solved:
                </p>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {requirementsList.map((req) => (
                <div
                  key={req.num}
                  onClick={() => {
                    setShowRequirementsModal(false);
                    navigateTo(req.page);
                  }}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 cursor-pointer transition-all flex items-start space-x-3 group"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-blue-300">
                        {req.num}. {req.title}
                      </span>
                      <span className="text-[10px] text-blue-400 font-mono flex items-center space-x-1">
                        <span>Test Screen ➔</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{req.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">100% Core Deliverable Complete</span>
              <button
                onClick={() => setShowRequirementsModal(false)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Close Checklist
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Firebase Cloud Database Modal */}
      <FirebaseModal
        isOpen={showFirebaseModal}
        onClose={() => setShowFirebaseModal(false)}
        onConfigUpdated={(status) => setIsFirebaseConnected(status)}
      />

      {/* Gmail OTP Configuration Modal */}
      <GmailOtpModal
        isOpen={showGmailModal}
        onClose={() => setShowGmailModal(false)}
      />
    </>
  );
}
