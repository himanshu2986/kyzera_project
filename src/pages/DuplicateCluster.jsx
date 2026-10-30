import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  ArrowLeft,
  Layers,
  AlertTriangle,
  Cpu,
  CheckCircle,
  TrendingDown,
  Wrench,
  Users,
  Clock,
  Sparkles,
  ShieldCheck,
  Split,
  Share2
} from 'lucide-react';

export default function DuplicateCluster() {
  const {
    navigateTo,
    selectedClusterId,
    clusters,
    markClusterResolved,
    showToast
  } = useCampus();

  const cluster = clusters.find(c => c.id === selectedClusterId) || clusters[0];
  const [subordinates, setSubordinates] = useState(cluster.subordinateReports || []);

  const handleDetach = (id) => {
    setSubordinates(prev => prev.filter(item => item.id !== id));
    showToast(`Detached Report #${id} from Cluster #${cluster.id}. Assigned as independent ticket.`, 'info');
  };

  const handleResolveCluster = () => {
    markClusterResolved(cluster.id);
  };

  const handleEscalate = () => {
    showToast(`Escalated Cluster #${cluster.id} directly to Campus Director & Provost.`, 'warning');
  };

  const handleDispatchOrder = () => {
    showToast('Work Order #5821 pre-dispatched to Plumbing & Electrical Division with Priority 1.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <button
            onClick={() => navigateTo('admin')}
            className="hover:text-white flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin Command Center</span>
          </button>
          <span>/</span>
          <span className="text-slate-300">Cluster Deduplication</span>
          <span>/</span>
          <span className="text-amber-400 font-mono font-bold">Cluster #{cluster.id}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleEscalate}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-colors"
          >
            Escalate to Director
          </button>

          <button
            onClick={handleResolveCluster}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-[0_0_15px_#10b981] transition-all"
          >
            Mark Entire Cluster Resolved ✓
          </button>
        </div>
      </div>

      {/* Cluster Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#101726] border border-[#1f293d] shadow-2xl relative">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
            {cluster.reportsCount} MERGED COMPLAINTS
          </span>
          <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40">
            {cluster.priority} PRIORITY
          </span>
          <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
            OPEN SINCE {cluster.openDays}
          </span>
          <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
            AFFECTED: {cluster.affectedCount}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Recurring Issue: {cluster.title}
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          AUTOMATED DEDUPLICATION: Cluster grouping across student bodies, facility wings, and residential maintenance logs.
        </p>
      </div>

      {/* Grid: AI Analysis & Master Ticket Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: AI Analysis & Diagnostic */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI Cluster Insights */}
          <div className="p-6 rounded-2xl bg-[#111726] border border-blue-900/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  AI Cluster Insights &amp; Cosine Correlation
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                {cluster.confidenceScore}% Semantic Match
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {cluster.aiSummary}
            </p>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Embedding Vector Similarity:</span>
                <span className="text-blue-400 font-bold">{cluster.confidenceScore}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full" style={{ width: `${cluster.confidenceScore}%` }}></div>
              </div>
            </div>
          </div>

          {/* Master Ticket Comparison & AI Platform Diagnosis */}
          <div className="p-6 rounded-2xl bg-[#111726] border border-amber-900/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  CANONICAL MASTER INCIDENT
                </span>
                <h3 className="text-sm font-bold text-amber-300">
                  Ticket #{cluster.masterTicketId} — {cluster.masterTitle}
                </h3>
              </div>
              <button
                onClick={() => navigateTo('ticket-detail', cluster.masterTicketId)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                Inspect Ticket ➔
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>AI Platform Diagnosis &amp; Root Cause Hypothesis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {cluster.diagnostic}
              </p>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider block mb-1">
                  RECOMMENDED ACTION PLAN:
                </span>
                <p className="text-xs text-slate-300">
                  {cluster.recommendedAction}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDispatchOrder}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-glow-sm"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Assign Work Order to Plumbing</span>
              </button>

              <button
                onClick={() => showToast('All 34 students notified via encrypted push token', 'info')}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2"
              >
                <span>Merge All &amp; Sync Push Alerts</span>
              </button>
            </div>
          </div>

          {/* Telemetry Pressure Correlation & Report Surge Chart */}
          <div className="p-6 rounded-2xl bg-[#101726] border border-[#1f293d] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Telemetry Pressure Correlation &amp; Student Surge
                </h3>
                <p className="text-[11px] text-slate-400">
                  Overlaying mechanical sensor PSI logs with student complaint timestamp spikes
                </p>
              </div>
              <span className="text-[10px] text-red-400 font-mono font-bold bg-red-950/60 border border-red-800 px-2 py-0.5 rounded">
                PRESSURE DROP AT 06:00 AM
              </span>
            </div>

            {/* Chart SVG */}
            <div className="w-full h-44 relative">
              <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
                {/* Background Grid */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="#1f293d" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#1f293d" strokeDasharray="3 3" />
                <line x1="0" y1="130" x2="600" y2="130" stroke="#1f293d" strokeDasharray="3 3" />

                {/* Hydraulic Pressure Line (Drops to 0 at 06:00 AM) */}
                <path
                  d="M 0,40 L 180,40 L 220,140 L 420,140 L 480,50 L 600,50"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                />

                {/* Complaint Surge Bars (Spike between 06:00 AM and 07:30 AM) */}
                {[
                  { x: 230, h: 40 },
                  { x: 260, h: 80 },
                  { x: 290, h: 110 },
                  { x: 320, h: 95 },
                  { x: 350, h: 70 },
                  { x: 380, h: 45 },
                  { x: 410, h: 20 },
                ].map((bar, i) => (
                  <rect
                    key={i}
                    x={bar.x}
                    y={140 - bar.h}
                    width="18"
                    height={bar.h}
                    rx="3"
                    fill="#3b82f6"
                    opacity="0.85"
                  />
                ))}
              </svg>

              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                <span>04:00 AM</span>
                <span className="text-red-400 font-bold">06:00 AM (Sensor Drop)</span>
                <span className="text-blue-400 font-bold">06:45 AM (Peak 28 reports/hr)</span>
                <span>08:00 AM</span>
                <span>10:00 AM</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-6 text-[11px] font-semibold pt-2 border-t border-slate-800">
              <span className="flex items-center space-x-1.5 text-red-400">
                <span className="w-3 h-0.5 bg-red-500"></span>
                <span>Water Line Pressure (PSI)</span>
              </span>
              <span className="flex items-center space-x-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
                <span>Student Ticket Volume</span>
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Subordinate Clustered Reports (List with Detach option) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Subordinate Clustered Reports
                </h3>
                <span className="text-[11px] text-slate-400">
                  {subordinates.length} reports merged into master cluster
                </span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                AUTO-TRIAGED
              </span>
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {subordinates.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{item.title}</span>
                    <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px]">
                      {item.similarity}% Match
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">
                    "{item.snippet}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                    <span className="font-mono text-slate-400">{item.studentId} • {item.time}</span>
                    <button
                      onClick={() => handleDetach(item.id)}
                      className="text-red-400 hover:text-red-300 font-medium flex items-center space-x-1"
                      title="Detach false positive"
                    >
                      <Split className="w-3 h-3" />
                      <span>Detach</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

