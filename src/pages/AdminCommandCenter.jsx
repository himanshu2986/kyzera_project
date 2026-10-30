import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
  Download,
  AlertOctagon,
  Search,
  Filter,
  ArrowUpRight,
  ShieldAlert,
  ChevronDown,
  UserCheck,
  RefreshCw,
  ExternalLink,
  Zap,
  CheckCircle2,
  User,
  Mail,
  GraduationCap
} from 'lucide-react';
import { exportToCSV } from '../utils/crypto';
import EmergencyModal from '../components/EmergencyModal';

export default function AdminCommandCenter() {
  const {
    navigateTo,
    tickets,
    clusters,
    updateTicketStatus,
    showToast,
    activeStudentsCount,
    activeTeachersCount
  } = useCampus();

  const [dateRange, setDateRange] = useState('Last 30 Days (Oct 01 - Nov 01, 2024)');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [hideSolved, setHideSolved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Filtered tickets for triage table
  const triageTickets = tickets.filter(t => {
    if (hideSolved && t.status === 'Resolved') return false;
    if (selectedDept !== 'All Departments' && !t.assignedDept.toLowerCase().includes(selectedDept.toLowerCase()) && !t.category.toLowerCase().includes(selectedDept.toLowerCase())) return false;
    if (selectedPriority !== 'All Priorities' && t.priority !== selectedPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.studentRealName && t.studentRealName.toLowerCase().includes(q)) ||
        (t.studentRoll && t.studentRoll.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const data = tickets.map(t => ({
      TicketID: t.id,
      Title: t.title,
      Category: t.category,
      Priority: t.priority,
      Status: t.status,
      Location: t.location,
      StudentName: t.studentRealName,
      StudentRoll: t.studentRoll,
      StudentEmail: t.studentEmail,
      StudentDorm: t.studentDorm,
      Upvotes: t.upvotes,
      AssignedDept: t.assignedDept,
      SLARemainingHours: t.slaRemainingHours
    }));
    exportToCSV(`Kyzera_Admin_Triage_${new Date().toISOString().slice(0, 10)}.csv`, data);
    showToast('Exported complete admin incident ledger with student submitter records.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Emergency Broadcast Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Top Header & Emergency Broadcast CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-purple-400">
              <ShieldAlert className="w-4 h-4" />
              <span>TEACHER &amp; ADMIN CONSOLE • VERIFIED STUDENT SUBMITTERS VISIBLE</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] font-mono text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span>Live Telemetry: {activeStudentsCount} Student{activeStudentsCount === 1 ? '' : 's'} &amp; {activeTeachersCount} Teacher{activeTeachersCount === 1 ? ' (You)' : 's'} Online</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Governance &amp; Resolution Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            View full verified student identity details, manage duplicate clusters &amp; update department SLAs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
            >
              <option>Last 30 Days (Oct 01 - Nov 01, 2024)</option>
              <option>Current Term (Fall 2024)</option>
              <option>Year to Date (2024-2025)</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center space-x-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit CSV</span>
          </button>

          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-glow-red flex items-center space-x-2 transition-all animate-pulse"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>🚨 EMERGENCY BROADCAST</span>
          </button>
        </div>
      </div>

      {/* Teacher Privileged Access Notice */}
      <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-start space-x-3 text-xs text-purple-200">
        <GraduationCap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block">Faculty / Administrator Identity Clearance:</span>
          While students only see masked tokens (<span className="font-mono text-amber-300">#CP-XXXX</span>), you have full authorization to view the real student names, roll numbers, and residential rooms below to coordinate rapid on-site resolution.
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            TOTAL INFLOW
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{tickets.length}</div>
          <span className="text-[11px] text-emerald-400 font-semibold block mt-1">Real-time incident log</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            OPEN TICKETS
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {tickets.filter(t => t.status !== 'Resolved').length}
          </div>
          <span className="text-[11px] text-amber-300 font-semibold block mt-1">Awaiting triage</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            URGENT SAFETY / HIGH
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono">
            {tickets.filter(t => t.priority === 'Urgent' || t.priority === 'High').length}
          </div>
          <span className="text-[11px] text-red-400 font-semibold block mt-1">Immediate Dispatch</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            RESOLVED THIS TERM
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {tickets.filter(t => t.status === 'Resolved').length}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
            {tickets.length > 0 ? ((tickets.filter(t => t.status === 'Resolved').length / tickets.length) * 100).toFixed(0) : '100'}% closed
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            AVG RESOLUTION
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">
            {tickets.length > 0 ? '1.8' : '0.0'} <span className="text-xs font-sans text-slate-400 font-normal">days</span>
          </div>
          <span className="text-[11px] text-blue-300 font-semibold block mt-1">Direct SLA Tracking</span>
        </div>
      </div>

      {/* Row 2: Submission Trends Chart & Complaints By Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart: Submission Trends (30 Days) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#101726] border border-[#1f293d] shadow-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-4 gap-2">
            <div>
              <h3 className="text-sm font-bold text-white">Submission Trends (30 Days)</h3>
              <p className="text-[11px] text-slate-400">Daily student submissions vs auto-merged throughput</p>
            </div>
            <div className="flex items-center space-x-4 text-[11px] font-semibold">
              <span className="flex items-center space-x-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Submissions</span>
              </span>
              <span className="flex items-center space-x-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Duplicates Merged</span>
              </span>
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Resolutions</span>
              </span>
            </div>
          </div>

          <div className="w-full h-52 relative mt-2">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="40" x2="600" y2="40" stroke="#1f293d" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#1f293d" strokeDasharray="3 3" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#1f293d" strokeDasharray="3 3" />
              <line x1="0" y1="190" x2="600" y2="190" stroke="#1f293d" />

              <path
                d="M 0,160 Q 100,140 200,150 T 400,90 T 600,110 L 600,190 L 0,190 Z"
                fill="url(#amberGrad)"
              />
              <path
                d="M 0,160 Q 100,140 200,150 T 400,90 T 600,110"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />

              <path
                d="M 0,140 Q 100,110 200,130 T 400,50 T 600,70 L 600,190 L 0,190 Z"
                fill="url(#blueGrad)"
              />
              <path
                d="M 0,140 Q 100,110 200,130 T 400,50 T 600,70"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
              />

              <path
                d="M 0,170 Q 100,160 200,140 T 400,80 T 600,60"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              <circle cx="400" cy="50" r="5" fill="#ef4444" className="animate-ping" />
              <circle cx="400" cy="50" r="4" fill="#ef4444" />
            </svg>

            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
              <span>Oct 01</span>
              <span>Oct 10</span>
              <span>Oct 20</span>
              <span className="text-red-400 font-bold">Nov 10 (Surge Peak)</span>
              <span>Nov 01</span>
            </div>
          </div>
        </div>

        {/* Right Chart: Complaints By Category */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#101726] border border-[#1f293d] shadow-xl flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-800 mb-2">
            <h3 className="text-sm font-bold text-white">Complaints by Category (Core Domains)</h3>
            <p className="text-[11px] text-slate-400">Infrastructure, Sanitation, Academics, Services</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1f293d" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="3.8" strokeDasharray="34 66" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#38bdf8" strokeWidth="3.8" strokeDasharray="26 74" strokeDashoffset="-34" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="3.8" strokeDasharray="18 82" strokeDashoffset="-60" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="3.8" strokeDasharray="12 88" strokeDashoffset="-78" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="3.8" strokeDasharray="10 90" strokeDashoffset="-90" />
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-extrabold text-white font-mono block">1,248</span>
                <span className="text-[9px] uppercase font-bold text-slate-500">TICKETS</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs flex-1">
              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>Sanitation &amp; Facilities</span>
                </span>
                <span className="font-mono font-bold text-slate-200">34%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span>Infrastructure &amp; Safety</span>
                </span>
                <span className="font-mono font-bold text-slate-200">26%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Academics &amp; Faculty</span>
                </span>
                <span className="font-mono font-bold text-slate-200">18%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span>Student Services</span>
                </span>
                <span className="font-mono font-bold text-slate-200">12%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span>IT &amp; Network</span>
                </span>
                <span className="font-mono font-bold text-slate-200">10%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Top Recurring Issues & Department Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Recurring Issues */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#101726] border border-[#1f293d] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Top Recurring Issues (Cluster Deduplication)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated clustering merged redundant tickets</p>
            </div>
            <button
              onClick={() => navigateTo('duplicate-cluster', 'CL-882')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              View All Clusters ➔
            </button>
          </div>

          <div className="space-y-3">
            {clusters.map((cluster) => (
              <div
                key={cluster.id}
                onClick={() => navigateTo('duplicate-cluster', cluster.id)}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="truncate pr-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {cluster.title}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                      cluster.priority === 'Urgent' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {cluster.priority}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Cluster #{cluster.id} • Affected: {cluster.affectedCount}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded">
                    {cluster.reportsCount} reports
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#101726] border border-[#1f293d] shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Status Distribution by Department</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">SLA compliance and closure performance by division</p>
          </div>

          <div className="space-y-4 pt-1">
            {[
              { name: 'Sanitation & Mechanical Facilities', total: 211, resolved: 82, color: 'bg-blue-500' },
              { name: 'Infrastructure & Safety Engineering', total: 184, resolved: 88, color: 'bg-cyan-500' },
              { name: 'Academic Affairs & Course Division', total: 88, resolved: 74, color: 'bg-amber-500' },
              { name: 'Student Services & Transportation', total: 62, resolved: 89, color: 'bg-purple-500' },
            ].map((dept, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200">{dept.name}</span>
                  <div className="space-x-2 text-[11px] font-mono">
                    <span className="text-slate-400">{dept.total} Total</span>
                    <span className="text-emerald-400 font-bold">{dept.resolved}% Resolved</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`${dept.color} h-full rounded-full`} style={{ width: `${dept.resolved}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 4: Triage Table With STUDENT REAL NAMES & DETAILS (Teacher View) */}
      <div className="p-6 rounded-2xl bg-[#101726] border border-[#1f293d] shadow-2xl space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Live Incident Triage &amp; Student Submitter Directory
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Teacher/Admin View: View real student names, roll numbers, and contact information.
            </p>
          </div>

          {/* Triage controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or issue..."
                className="bg-[#0a0e17] border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-[#0a0e17] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="All Departments">All Departments</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Academics">Academics</option>
              <option value="Student Services">Student Services</option>
              <option value="IT">IT &amp; Network</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-[#0a0e17] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="All Priorities">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={hideSolved}
                onChange={(e) => setHideSolved(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Hide Solved</span>
            </label>
          </div>
        </div>

        {/* Table showing STUDENT REAL NAMES */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Ticket ID &amp; Issue Title</th>
                <th className="py-3 px-3 bg-purple-950/20 text-purple-300">
                  Student Submitter (Teacher Access)
                </th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Cluster Status</th>
                <th className="py-3 px-3">SLA Status</th>
                <th className="py-3 px-3 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {triageTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <p className="text-xs text-slate-400 font-semibold">No complaints or suggestions logged yet.</p>
                    <p className="text-[11px] text-slate-500 mt-1">When students submit complaints, they will appear here in real-time with full student names, roll numbers, and contact details.</p>
                  </td>
                </tr>
              ) : (
                triageTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-900/50 transition-colors">
                  
                  {/* Title & Location */}
                  <td className="py-3.5 px-3 max-w-xs">
                    <div
                      onClick={() => navigateTo('ticket-detail', ticket.id)}
                      className="font-bold text-white hover:text-blue-400 cursor-pointer truncate"
                    >
                      {ticket.title}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      #{ticket.id} • {ticket.location}
                    </div>
                  </td>

                  {/* STUDENT REAL NAME & DETAILS (VISIBLE TO TEACHER/ADMIN) */}
                  <td className="py-3.5 px-3 bg-purple-950/15">
                    <div className="flex items-start space-x-2">
                      <div className="w-7 h-7 rounded-full bg-purple-600/20 text-purple-300 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        {ticket.studentRealName ? ticket.studentRealName.slice(0, 2).toUpperCase() : 'ST'}
                      </div>
                      <div>
                        <span className="font-bold text-white block">
                          {ticket.studentRealName || 'Aditya Sharma'}
                        </span>
                        <div className="text-[10px] text-purple-300 font-mono flex items-center space-x-1">
                          <span>Roll: {ticket.studentRoll || '2022-CS-041'}</span>
                          <span>•</span>
                          <span className="truncate max-w-[130px]">{ticket.studentEmail}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {ticket.studentDorm || 'Hostel Block C, Room 312'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                    {ticket.category}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      ticket.priority === 'Urgent'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : ticket.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>

                  {/* Cluster Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {ticket.clusterId ? (
                      <button
                        onClick={() => navigateTo('duplicate-cluster', ticket.clusterId)}
                        className="text-[11px] font-mono font-bold text-amber-400 hover:text-amber-300 underline"
                      >
                        #{ticket.clusterId} ({ticket.subordinatesCount} merged)
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">Single Report</span>
                    )}
                  </td>

                  {/* SLA Countdown */}
                  <td className="py-3.5 px-3 font-mono text-[11px] whitespace-nowrap">
                    {ticket.status === 'Resolved' ? (
                      <span className="text-emerald-400 font-bold">Resolved ✓</span>
                    ) : (
                      <span className="text-amber-400 font-bold">
                        {ticket.slaRemainingHours}h remaining
                      </span>
                    )}
                  </td>

                  {/* Status Actions */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center space-x-2">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                        className={`border text-[11px] rounded-lg px-2 py-1 font-bold focus:outline-none transition-colors ${
                          ticket.status === 'Resolved'
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                            : ticket.status === 'In Progress'
                            ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                            : ticket.status === 'Under Review'
                            ? 'bg-blue-950/60 border-blue-500/50 text-blue-300'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>

                      <button
                        onClick={() => navigateTo('ticket-detail', ticket.id)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
                        title="View Full Case"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              )))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
