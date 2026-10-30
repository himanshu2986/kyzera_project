import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Hash,
  Download,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  Eye,
  Check
} from 'lucide-react';
import { exportToCSV, sha256 } from '../utils/crypto';

export default function PrivacyAudit() {
  const {
    auditLogs,
    requestIdentityReveal,
    tickets,
    currentUser,
    showToast
  } = useCampus();

  const [isRevealModalOpen, setIsRevealModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState('CP-4011');
  const [justification, setJustification] = useState(
    'Immediate life-safety issue: Electrical short in Room B-204 requires emergency room inspection and student confirmation.'
  );
  const [faculty1Signed, setFaculty1Signed] = useState(true);
  const [faculty2Signed, setFaculty2Signed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedStudentResult, setRevealedStudentResult] = useState(null);

  const filteredLogs = auditLogs.filter(log => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.requester.toLowerCase().includes(q) ||
      log.ticketId.toLowerCase().includes(q) ||
      log.justification.toLowerCase().includes(q) ||
      log.status.toLowerCase().includes(q)
    );
  });

  const handleExportAudit = () => {
    const data = auditLogs.map(l => ({
      AuditID: l.id,
      Timestamp: l.timestamp,
      Requester: l.requester,
      TicketID: l.ticketId,
      Justification: l.justification,
      Status: l.status,
      DualFacultySignOff: l.facultySignOff,
      CryptographicHash: l.hash
    }));
    exportToCSV(`Kyzera_Privacy_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`, data);
    showToast('Exported immutable privacy audit log to CSV.', 'success');
  };

  const handleExecuteReveal = async (e) => {
    e.preventDefault();
    if (!faculty1Signed || !faculty2Signed) {
      showToast('Dual-Faculty protocol mandates signatures from both accredited ethics faculty members!', 'error');
      return;
    }

    const newLog = await requestIdentityReveal(
      selectedTicketId,
      justification,
      'Prof. David Tan',
      'Prof. Sarah Jenkins'
    );

    setRevealedStudentResult({
      studentName: 'Aditya Sharma',
      studentEmail: 'a.sharma@kyzera.edu',
      rollNumber: '2022-CS-041',
      room: 'Hostel Block C, Room 312',
      hash: newLog.hash
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800/60 text-purple-400 text-xs font-mono font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>CHAPTER §4.2 GOVERNANCE LEDGER • SHA-256 Hash Guard Verified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Identity Access &amp; De-anonymization Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable tamper-proof ledger of all authorized read/de-identity inspections under Campus Privacy Charter §4.2
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportAudit}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center space-x-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Log</span>
          </button>

          <button
            onClick={() => {
              setRevealedStudentResult(null);
              setIsRevealModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.35)] flex items-center space-x-2 transition-all"
          >
            <KeyRound className="w-4 h-4" />
            <span>Request Identity Reveal</span>
          </button>
        </div>
      </div>

      {/* Accountable Privacy Notice Banner */}
      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 flex items-start space-x-3 text-xs text-purple-200">
        <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block">Strict Accountable Privacy Protocol:</span>
          Identity reveals are cryptographically signed, recorded in permanent immutable logs, and enforced by the dual-faculty ethics unmasking convention. Students receive automated cryptographic audit notices whenever their token is unmasked.
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            TOTAL DE-MASKED REQUESTS
          </span>
          <div className="text-3xl font-extrabold text-white font-mono">18</div>
          <span className="text-[11px] text-slate-400 block mt-1">2024-2025 Academic Year</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            APPROVED &amp; UNMASKED
          </span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">12</div>
          <span className="text-[11px] text-emerald-400 block mt-1">Under strict ethics mandate</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            DENIED / REJECTED
          </span>
          <div className="text-3xl font-extrabold text-red-400 font-mono">2</div>
          <span className="text-[11px] text-red-400 block mt-1">Non-compliant justification</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            AVG ETHICS SIGN-OFF
          </span>
          <div className="text-3xl font-extrabold text-purple-400 font-mono">2.1 <span className="text-sm font-sans text-slate-400 font-normal">hrs</span></div>
          <span className="text-[11px] text-purple-300 block mt-1">MIN 24HR MANDATE WINDOW</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-6 rounded-2xl bg-[#101726] border border-[#1f293d] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Immutable Ledger Audit Stream</h3>
            <p className="text-xs text-slate-400">Cryptographically verifiable unmasking transactions</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit records..."
              className="bg-[#0a0e17] border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Admin / Requester</th>
                <th className="py-3 px-3">Ticket Involved</th>
                <th className="py-3 px-3">Justification / Legal Basis</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Dual Sign-off</th>
                <th className="py-3 px-3 text-right">Ledger Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-white">
                    {log.requester}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-blue-400 font-bold whitespace-nowrap">
                    #{log.ticketId}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 max-w-xs leading-snug">
                    {log.justification}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.status.includes('Approved')
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 font-medium">
                    {log.facultySignOff}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-purple-400">
                    {log.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cryptographic Ledger Trail Banner */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-2">
          <span>Live Cryptographic Audit Trail • Block #48129</span>
          <span>SHA-256 Merkle Root: 0x93bf81...d21e (Consensus Verified)</span>
        </div>
      </div>

      {/* Identity Reveal Modal / Drawer */}
      {isRevealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121826] border border-purple-500/50 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsRevealModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/40">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Dual-Faculty Identity Reveal</h3>
                <p className="text-xs text-purple-300">
                  Mandatory ethics approval to de-anonymize an anonymous token under §4.2
                </p>
              </div>
            </div>

            {!revealedStudentResult ? (
              <form onSubmit={handleExecuteReveal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Target Ticket
                  </label>
                  <select
                    value={selectedTicketId}
                    onChange={(e) => setSelectedTicketId(e.target.value)}
                    className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {tickets.map(t => (
                      <option key={t.id} value={t.id}>
                        Ticket #{t.id} - {t.title.slice(0, 48)} ({t.priority})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Emergency Justification Note (Permanent Public Record)
                  </label>
                  <textarea
                    rows={3}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    required
                    className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Dual Faculty Signatures Section */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Dual Ethics Board Signatures Required:
                  </span>

                  {/* Signer 1 */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <div>
                      <span className="text-white font-bold block">Prof. David Tan</span>
                      <span className="text-[10px] text-slate-400">Chair, Infrastructure &amp; Safety</span>
                    </div>
                    {faculty1Signed ? (
                      <span className="text-emerald-400 font-mono font-bold flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Key Signed: 0x7F...B4</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setFaculty1Signed(true)}
                        className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-[10px]"
                      >
                        Sign
                      </button>
                    )}
                  </div>

                  {/* Signer 2 */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <div>
                      <span className="text-white font-bold block">Prof. Sarah Jenkins</span>
                      <span className="text-[10px] text-slate-400">Faculty Ethics Board Delegate</span>
                    </div>
                    {faculty2Signed ? (
                      <span className="text-emerald-400 font-mono font-bold flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Key Signed: 0x9A...C8</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setFaculty2Signed(true)}
                        className="px-2.5 py-1 rounded bg-purple-600 text-white font-bold text-[10px]"
                      >
                        Sign with Cryptographic Key
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsRevealModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!faculty1Signed || !faculty2Signed}
                    className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center space-x-2"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Sign with Key &amp; Reveal</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Verified De-Anonymized Details Card */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Dual-Faculty Authorization Certified</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    The following verified student record was unmasked and permanently appended to Ledger Hash <span className="font-mono text-purple-300">{revealedStudentResult.hash}</span>:
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Student Name:</span>
                    <span className="font-bold text-white">{revealedStudentResult.studentName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Institutional Email:</span>
                    <span className="font-mono text-blue-400">{revealedStudentResult.studentEmail}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">University Roll ID:</span>
                    <span className="font-mono text-white">{revealedStudentResult.rollNumber}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Residential Dorm:</span>
                    <span className="text-slate-200">{revealedStudentResult.room}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setIsRevealModalOpen(false)}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs"
                  >
                    Close &amp; Return to Ledger
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

