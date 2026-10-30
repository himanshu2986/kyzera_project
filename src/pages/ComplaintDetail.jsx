import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  ArrowLeft,
  Share2,
  Printer,
  ThumbsUp,
  Bell,
  Lock,
  ShieldCheck,
  Layers,
  Clock,
  CheckCircle2,
  User,
  Send,
  MessageSquare,
  AlertTriangle,
  ZoomIn,
  ExternalLink,
  Edit3,
  UserCheck,
  GraduationCap,
  EyeOff
} from 'lucide-react';
import LightboxModal from '../components/LightboxModal';
import { isTicketOwner } from '../utils/crypto';

export default function ComplaintDetail() {
  const {
    navigateTo,
    selectedTicketId,
    tickets,
    toggleUpvote,
    updateTicketStatus,
    withdrawTicket,
    submitTicketRating,
    addComment,
    currentUser,
    showToast
  } = useCampus();

  const [newComment, setNewComment] = useState('');
  const [subscribedSms, setSubscribedSms] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoTitle, setActivePhotoTitle] = useState('');
  const [activePhotoUrl, setActivePhotoUrl] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [hasRated, setHasRated] = useState(false);

  const ticket = (tickets && tickets.find(t => t.id === selectedTicketId)) || (tickets && tickets[0]);
  const isTeacherOrAdmin = currentUser?.role?.includes('Admin') || currentUser?.role?.includes('Teacher');
  const isOwner = isTicketOwner(ticket, currentUser);

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#101726] border border-slate-800 text-slate-400 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">No Complaints Logged Yet</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            All complaints and suggestions have been cleared. Submit a new complaint or suggestion to view real-time incident tracking and administrative action.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-3">
            <button
              onClick={() => navigateTo('submit')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-sm transition-all"
            >
              <span>+ Submit New Complaint</span>
            </button>
            <button
              onClick={() => navigateTo(isTeacherOrAdmin ? 'admin' : 'dashboard')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors"
            >
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(`Encrypted incident link copied: #${ticket.id}`, 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleSms = () => {
    setSubscribedSms(!subscribedSms);
    showToast(
      !subscribedSms
        ? 'Subscribed to real-time SMS & push SLA alerts for this ticket!'
        : 'Unsubscribed from ticket SMS updates.',
      !subscribedSms ? 'success' : 'info'
    );
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(ticket.id, newComment);
    setNewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageTitle={activePhotoTitle}
        imageUrl={activePhotoUrl}
      />

      {/* Top Breadcrumb & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <button
            onClick={() => navigateTo(isTeacherOrAdmin ? 'admin' : 'dashboard')}
            className="hover:text-white flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isTeacherOrAdmin ? 'Admin Center' : 'My Dashboard'}</span>
          </button>
          <span>/</span>
          <span className="text-slate-300">{ticket.category}</span>
          <span>/</span>
          <span className="text-blue-400 font-mono font-bold">Ticket #{ticket.id}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateTo(isTeacherOrAdmin ? 'admin' : 'dashboard')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Link</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Case</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Ticket Content & Duplicates & Comments */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Ticket Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#101726] border border-[#1f293d] shadow-2xl relative">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {ticket.category}
                </span>
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  ticket.priority === 'Urgent'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {ticket.priority} PRIORITY
                </span>
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  ticket.status === 'Resolved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {ticket.status}
                </span>
              </div>

              {/* Admin/Teacher Quick Status Updater or Student Self-Resolve */}
              {isTeacherOrAdmin ? (
                <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-purple-500/40">
                  <span className="text-[10px] uppercase font-bold text-purple-300">Teacher Action:</span>
                  <select
                    value={ticket.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      let note = '';
                      if (newStatus === 'Resolved') {
                        note = prompt('Enter resolution note to email the student (optional):', 'The facility issue has been inspected and resolved by campus engineering.') || '';
                      }
                      updateTicketStatus(ticket.id, newStatus, note);
                    }}
                    className="bg-[#0f172a] text-xs font-bold text-white focus:outline-none cursor-pointer px-2 py-1 rounded-lg border border-purple-500/30"
                  >
                    <option value="Submitted" className="bg-[#0f172a] text-white">Submitted</option>
                    <option value="Under Review" className="bg-[#0f172a] text-white">Under Review</option>
                    <option value="In Progress" className="bg-[#0f172a] text-white">In Progress</option>
                    <option value="Resolved" className="bg-[#0f172a] text-white">Resolved</option>
                  </select>
                </div>
              ) : (
                ticket.status !== 'Resolved' && isOwner && (
                  <button
                    onClick={() => {
                      if (window.confirm('Mark this complaint as resolved / withdrawn?')) {
                        withdrawTicket(ticket.id, 'Resolved by student submitter');
                      }
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Withdraw / Mark Solved</span>
                  </button>
                )
              )}
            </div>

            {/* SUBMITTER IDENTITY CARD: ROLE BASED (STUDENT VS TEACHER) */}
            {isTeacherOrAdmin ? (
              /* TEACHER VIEW: REAL STUDENT NAME & CONTACT DETAILS VISIBLE */
              <div className="mb-5 p-4 rounded-xl bg-purple-950/30 border border-purple-500/50">
                <div className="flex items-center justify-between pb-2 border-b border-purple-800/40 mb-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-purple-300">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verified Student Submitter (Teacher Access Clearance)</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-900/40 px-2 py-0.5 rounded">
                    Token: #{ticket.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Student Full Name:</span>
                    <span className="text-white font-bold text-sm">{ticket.studentRealName || 'Aditya Sharma'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">University Roll Number:</span>
                    <span className="text-purple-300 font-mono font-bold">{ticket.studentRoll || '2022-CS-041'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Institutional Email:</span>
                    <span className="text-blue-400 font-mono">{ticket.studentEmail || 'a.sharma@kyzera.edu'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Department &amp; Dormitory:</span>
                    <span className="text-slate-200">{ticket.studentDept} • {ticket.studentDorm}</span>
                  </div>
                </div>
              </div>
            ) : isOwner ? (
              /* STUDENT VIEW: LOGGED-IN STUDENT LOOKING AT THEIR OWN COMPLAINT */
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <User className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-white font-semibold block">
                      Submitted by You: <span className="text-emerald-300 font-bold">{ticket.studentRealName || currentUser?.name}</span>
                      <span className="text-slate-400 font-mono text-[11px] ml-2">({ticket.studentRoll || currentUser?.roll} • {ticket.studentEmail || currentUser?.email})</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Publicly masked from other students as <span className="text-amber-300 font-mono font-bold">Anonymous Student #{ticket.studentId}</span> for your peer privacy.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  YOUR COMPLAINT
                </span>
              </div>
            ) : (
              /* STUDENT VIEW: PEER VIEWING ANOTHER STUDENT'S COMPLAINT */
              <div className="mb-5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <Lock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <span className="text-slate-200 font-semibold block">
                      Submitter: <span className="text-amber-300 font-mono font-bold">Anonymous Student #{ticket.studentId}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Peer identity masked. Protected by Kyzera Student Privacy Charter §4.2.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-amber-400 font-mono bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                  ANONYMOUS
                </span>
              </div>
            )}

            {/* Submitter & SLA Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono mb-4 pb-4 border-b border-slate-800">
              <span>Ticket ID: #{ticket.id}</span>
              <span>•</span>
              <span>Location: {ticket.location}</span>
              <span>•</span>
              <span>Submitted Nov 10, 2024 at 07:14 AM</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">
                SLA: {ticket.slaRemainingHours}h remaining
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              {ticket.title}
            </h1>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
              {ticket.description}
            </p>

            {/* Attached Visual Evidence Gallery */}
            <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                <div className="flex items-center space-x-2">
                  <span>Attached Evidence Gallery</span>
                  <span className="text-slate-500 font-normal">({ticket.evidence.length} files)</span>
                </div>
                <span className="text-[10px] text-blue-400 font-mono">
                  SHA-256 ENCRYPTED PROOF
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ticket.evidence.map((file, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setActivePhotoTitle(file.name);
                      setActivePhotoUrl(file.previewUrl || '');
                      setLightboxOpen(true);
                    }}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/60 cursor-pointer flex items-center justify-between group transition-colors overflow-hidden"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      {file.previewUrl ? (
                        <img
                          src={file.previewUrl}
                          alt={file.name}
                          className="w-11 h-11 rounded-lg object-cover border border-slate-700 flex-shrink-0 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-950/50 border border-blue-800/50 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform flex-shrink-0">
                          <ZoomIn className="w-4 h-4" />
                        </div>
                      )}
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-200 block group-hover:text-blue-300 truncate">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-slate-500">{file.size}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                      Inspect ➔
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cryptographically timestamped on SHA-256 ledger • Verified SSO Incident Authenticated</span>
              </div>
            </div>

            {/* Post-Resolution Satisfaction Rating (Closed-Loop Redressal) */}
            {ticket.status === 'Resolved' && (
              <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#111726] to-slate-900 border border-emerald-500/40 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">
                      Resolution Quality & Student Satisfaction
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded uppercase font-bold">
                    CLOSED LOOP AUDIT
                  </span>
                </div>

                {ticket.resolutionNote && (
                  <div className="mb-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Official Resolution Remark:</span>
                    <p className="italic text-emerald-300 font-medium">"{ticket.resolutionNote}"</p>
                  </div>
                )}

                {ticket.rating || hasRated ? (
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-emerald-300 font-bold block">
                        Student Satisfaction Recorded: {ticket.rating || userRating} / 5 Stars
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {ticket.ratingComment || ratingFeedback || 'Thank you for rating campus facilities!'}
                      </p>
                    </div>
                    <div className="flex text-amber-400 text-lg">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < (ticket.rating || userRating) ? 'text-amber-400' : 'text-slate-600'}>★</span>
                      ))}
                    </div>
                  </div>
                ) : isOwner ? (
                  <div>
                    <p className="text-xs text-slate-300 mb-2">
                      Please rate the resolution speed and quality provided by campus administration:
                    </p>
                    <div className="flex items-center space-x-2 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setUserRating(star)}
                          className="text-2xl transition-transform hover:scale-125 focus:outline-none"
                        >
                          <span className={(hoverRating || userRating) >= star ? 'text-amber-400' : 'text-slate-600'}>
                            ★
                          </span>
                        </button>
                      ))}
                      <span className="text-xs text-slate-400 ml-2 font-mono">
                        {userRating ? `${userRating} of 5 Stars` : 'Tap stars to rate'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={ratingFeedback}
                        onChange={(e) => setRatingFeedback(e.target.value)}
                        placeholder="Optional feedback comment (e.g., Fixed promptly, good work)"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        disabled={!userRating}
                        onClick={() => {
                          if (!userRating) return;
                          submitTicketRating(ticket.id, userRating, ratingFeedback);
                          setHasRated(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-glow-sm"
                      >
                        Submit Rating
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Awaiting satisfaction rating from verified student submitter.
                  </p>
                )}
              </div>
            )}

            {/* Upvote & SMS Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => toggleUpvote(ticket.id)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center space-x-2 ${
                  ticket.hasUpvoted
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-glow-sm'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${ticket.hasUpvoted ? 'fill-blue-400 text-blue-400' : ''}`} />
                <span>Upvote Issue ({ticket.upvotes} Supported)</span>
              </button>

              <button
                onClick={handleToggleSms}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-colors flex items-center space-x-2 ${
                  subscribedSms
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>{subscribedSms ? 'Subscribed to Alerts ✓' : 'Subscribe to SMS Updates'}</span>
              </button>
            </div>

          </div>

          {/* Related Complaints (Duplicate Group - 34 Reports) */}
          <div className="p-6 rounded-2xl bg-[#101726] border border-amber-900/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-amber-400 font-bold">★</span>
                <h3 className="text-sm font-bold text-white">
                  Related Complaints (Duplicate Group - 34 Reports)
                </h3>
              </div>
              <button
                onClick={() => navigateTo('duplicate-cluster', 'CL-882')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
              >
                <span>Open Duplicate Cluster Graph</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Kyzera NLP vector similarity autonomously identified clustering student associations and merged telemetry signals to escalate campus engineering priority.
            </p>

            <div className="space-y-2">
              {[
                { id: 'HC-4027', title: 'No water in Block C washrooms every morning', match: '92% Match', time: 'Nov 10, 06:45 AM' },
                { id: 'HC-4021', title: 'Hostel C low water pressure 2nd floor', match: '89% Match', time: 'Nov 10, 07:05 AM' },
                { id: 'HC-3998', title: 'Water pump making revving noises in C wing', match: '81% Match', time: 'Nov 09, 06:15 PM' },
              ].map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="text-slate-200 font-medium">{sub.title}</span>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Ticket #{sub.id} • Anonymous Report • {sub.time}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    {sub.match}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Comments / Resolution Updates Thread */}
          <div className="p-6 rounded-2xl bg-[#101726] border border-[#1f293d] shadow-xl space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">
                Public Transparency &amp; Activity Log ({ticket.comments?.length || 0})
              </h3>
            </div>

            <div className="space-y-3">
              {ticket.comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-200">{comment.author}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{comment.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{comment.text}</p>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="pt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Post public observation as ${isTeacherOrAdmin ? currentUser.name : 'Anonymous Student'}...`}
                  className="flex-1 bg-[#0a0e17] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-sm transition-all flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: Resolution Roadmap / SLA Stepper & Personnel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Resolution Roadmap Stepper */}
          <div className="p-6 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-xl space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <span>Status Tracking Roadmap</span>
                <span className="text-emerald-400 font-mono">ESTIMATED SLA: 48h</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>Current Status: <span className="font-bold text-blue-400 font-mono">{ticket.status}</span></span>
                <span className="text-amber-400 font-bold font-mono">
                  {ticket.slaRemainingHours} hrs remaining
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full" style={{
                  width: ticket.status === 'Resolved' ? '100%' : ticket.status === 'In Progress' ? '75%' : ticket.status === 'Under Review' ? '50%' : '25%'
                }}></div>
              </div>
            </div>

            {/* Stepper Steps */}
            <div className="space-y-5 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-800">
              {ticket.roadmap.map((step, idx) => {
                const isCompleted = step.status === 'completed' || (ticket.status === 'Resolved');
                const isActive = step.status === 'active' && ticket.status !== 'Resolved';

                return (
                  <div key={idx} className="relative flex items-start space-x-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-[0_0_10px_#10b981]'
                        : isActive
                        ? 'bg-blue-600 text-white shadow-glow animate-pulse'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${
                          isActive ? 'text-blue-300' : isCompleted ? 'text-white' : 'text-slate-400'
                        }`}>
                          {step.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Personnel & Governance */}
          <div className="p-6 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
              Assigned Personnel &amp; Governance
            </h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  DT
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Eng. David Tan</span>
                  <span className="text-[10px] text-slate-400">Chief Maintenance Lead, Facilities Dept</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                  SJ
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Prof. Sarah Jenkins</span>
                  <span className="text-[10px] text-slate-400">Student Affairs Oversight Liaison</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
