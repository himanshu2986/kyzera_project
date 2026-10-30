import React from 'react';
import { useCampus } from '../context/CampusContext';
import {
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  BellRing,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
  Activity,
  FileText,
  ChevronRight,
  MapPin,
  Lock
} from 'lucide-react';

export default function Landing() {
  const { navigateTo, tickets, toggleUpvote, liveStream } = useCampus();

  const featuredTickets = tickets.slice(0, 3);

  return (
    <div className="space-y-24 py-8">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-12 text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        {/* Hero Top Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-semibold mb-6 shadow-glow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>Verified Access • Anonymous • AI-Assisted Resolution</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Raise Your Voice. <br />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            Fix Your Campus.
          </span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Verified students, faculty, and staff submit complaints and suggestions that are automatically categorized, deduplicated, and prioritized for speedy administration.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigateTo('login')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-glow hover:shadow-glow transition-all flex items-center justify-center space-x-2.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Get Started (College SSO)</span>
          </button>

          <button
            onClick={() => navigateTo('dashboard')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
          >
            <span>View Live Resolution Dashboard</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* 2. REAL-TIME PUBLIC TICKER */}
        <div className="mt-14 max-w-5xl mx-auto text-left">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-xs font-bold text-amber-300 tracking-wider uppercase">
                REAL-TIME PUBLIC TICKER ({tickets.length})
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Live updates synced every 15s
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => navigateTo('ticket-detail', ticket.id)}
                className="p-5 rounded-2xl bg-[#111726]/90 border border-[#1f293d] hover:border-blue-500/60 hover:shadow-glow-sm cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      ticket.priority === 'Urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      ticket.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {ticket.priority}: {ticket.status}
                    </span>
                    <span className="text-slate-500 font-mono">Ticket #{ticket.id}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                    {ticket.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-semibold flex items-center space-x-1">
                    <span>👍</span>
                    <span>{ticket.upvotes} Upvotes</span>
                  </span>
                  <span className="text-blue-400 font-medium truncate max-w-[120px]">
                    {ticket.assignedDept.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. IMPACT STATS BAR */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-[#0f1523] border border-[#1e283b] p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center shadow-xl">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
              14.2k+
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
              ACTIVE STUDENTS
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight font-mono">
              94.8%
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
              RESOLUTION RATE
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight font-mono">
              &lt; 48h
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
              AVG. RESPONSE TIME
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight font-mono">
              100%
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
              IDENTITY PROTECTED
            </div>
          </div>
        </div>
      </section>

      {/* 4. ARCHITECTED FOR ACCOUNTABILITY (4 Feature Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
            ARCHITECTED FOR ACCOUNTABILITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Enterprise Infrastructure for Campus Civic Action
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Engineered to replace buried emails and chaotic student group chats with a transparent, audited resolution engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#111726] border border-[#1f293d] hover:border-slate-600 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Verified College Email Access
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authenticate exclusively via @kyzera.edu SSO. Student registration without sacrificing identity secrecy.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-blue-400 font-semibold">
              Zero-Knowledge Hashing ➔
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#111726] border border-[#1f293d] hover:border-slate-600 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              AI Categorisation &amp; Routing
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Neural engine parses plain text descriptions and routes tickets to Facilities, IT, or Provost with zero human delays.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-400 font-semibold">
              Sub-second NLP Dispatch ➔
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#111726] border border-[#1f293d] hover:border-slate-600 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Duplicate Detection &amp; Clustering
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Merges 50+ complaints about the same broken pipe or Wi-Fi outage into unified high-momentum issues to amplify collective voice.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-cyan-400 font-semibold">
              Vector Semantic Deduplication ➔
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-[#111726] border border-[#1f293d] hover:border-slate-600 transition-all">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-5">
              <BellRing className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Priority &amp; Escalation Alerts
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Emergency safety alerts bypass queue and notify admin on-call via instant SMS/push notification within 3 minutes.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-red-400 font-semibold">
              24/7 Rapid Incident Trigger ➔
            </div>
          </div>

        </div>
      </section>

      {/* 5. TRANSPARENT LIFECYCLE (How Kyzera Resolves Incidents) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
            TRANSPARENT LIFECYCLE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Kyzera Resolves Incidents
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            From first photo capture to verified contractor resolution, every step is transparent and timestamped.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="p-7 rounded-2xl bg-[#101726] border border-[#1f293d] flex flex-col justify-between relative shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-glow-sm">
                  1
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  INITIATION PHASE
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Submit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select category or let AI parse your issue, add photo, toggle anonymous protection with one tap to auto-mask real metadata.
              </p>

              <div className="mt-5 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Audio/Graphic Proof:</span>
                  <span className="font-mono text-emerald-400">Allowed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Anonymous Guard:</span>
                  <span className="font-mono text-blue-400 font-bold">ACTIVE (ON)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Encrypted on 6-digit verification token</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-7 rounded-2xl bg-[#101726] border border-[#1f293d] flex flex-col justify-between relative shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center justify-center shadow-glow-amber">
                  2
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  PROCESSING PHASE
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Classifies &amp; Clusters</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Neural classifier identifies recurring campus trends, detects duplicate reports, and assigns predictive urgency priority score.
              </p>

              <div className="mt-5 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Natural Header Analysis</span>
                  <span className="font-mono text-amber-400 font-bold">98.4% Confidence</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[98.4%]"></div>
                </div>
                <div className="text-[10px] text-slate-400">Merged with 12 Admin Reports</div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Automated dept routing / Facilities</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-7 rounded-2xl bg-[#101726] border border-[#1f293d] flex flex-col justify-between relative shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-sm flex items-center justify-center">
                  3
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  RESOLUTION PHASE
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Admin Resolves &amp; Closes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Campus facility work orders pre-dispatched instantly with SLA deadlines, confirmed by online public tracking and student sign-off.
              </p>

              <div className="mt-5 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Work Order:</span>
                  <span className="font-mono text-white">#5821 Dispatched</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Resolution:</span>
                  <span className="font-mono text-emerald-400 font-bold">Final Relay Secured</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Permanent public audit log</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. KYZERA LIVE STREAM TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#0c121d] border border-[#1e293d] p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Kyzera Live Stream</span>
              <span className="text-[10px] text-slate-500 font-mono font-normal">(UPDATED IN REAL TIME)</span>
            </div>
            <div className="text-xs text-blue-400 flex items-center space-x-1">
              <span>Kyzera Telemetry Live</span>
              <span className="text-[10px]">●</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liveStream.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3"
              >
                <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
                  item.color === 'emerald' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' :
                  item.color === 'amber' ? 'bg-amber-400' : 'bg-blue-400'
                }`}></div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.text}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                  <span className="inline-block mt-2 text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#131d2e] to-[#0c131f] border border-[#24344d] text-center shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Have an unresolved issue right now?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Connect maintenance or academic issues faster. Submit a ticket in less than 30 seconds and let automated severity routing begin.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigateTo('submit')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-glow transition-all"
            >
              Submit a Complaint Now
            </button>
            <button
              onClick={() => navigateTo('login')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
            >
              Read Student Rights FAQ
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

