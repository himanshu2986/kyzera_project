import React, { useState, useMemo } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building,
  Layers,
  ChevronRight,
  ThumbsUp,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { exportToCSV } from '../utils/crypto';

export default function StudentDashboard() {
  const {
    navigateTo,
    tickets,
    toggleUpvote,
    currentUser,
    showToast
  } = useCampus();

  const [activeTab, setActiveTab] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPriority, setSelectedPriority] = useState('Any Priority');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recently Updated');

  // Filter logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Tab filter
      if (activeTab === 'Active' && t.status === 'Resolved') return false;
      if (activeTab === 'Under Review' && t.status !== 'Under Review') return false;
      if (activeTab === 'In Progress' && t.status !== 'In Progress') return false;
      if (activeTab === 'Resolved' && t.status !== 'Resolved') return false;

      // Category filter
      if (selectedCategory !== 'All Categories' && !t.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;

      // Priority filter
      if (selectedPriority !== 'Any Priority' && t.priority !== selectedPriority) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesId = t.id.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesDept = t.assignedDept.toLowerCase().includes(q);
        const matchesLoc = t.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesId && !matchesDesc && !matchesDept && !matchesLoc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Most Upvoted') return b.upvotes - a.upvotes;
      if (sortBy === 'Urgent First') {
        const order = { Urgent: 3, High: 2, Medium: 1, Low: 0 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      }
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });
  }, [tickets, activeTab, selectedCategory, selectedPriority, searchQuery, sortBy]);

  const handleExport = () => {
    const dataToExport = tickets.map(t => ({
      TicketID: t.id,
      Title: t.title,
      Category: t.category,
      Priority: t.priority,
      Status: t.status,
      Location: t.location,
      Upvotes: t.upvotes,
      AssignedDept: t.assignedDept,
      Created: t.createdAt
    }));
    exportToCSV(`Kyzera_Grievances_${new Date().toISOString().slice(0, 10)}.csv`, dataToExport);
    showToast('Exported grievance report to CSV successfully.', 'success');
  };

  const counts = {
    all: tickets.length,
    active: tickets.filter(t => t.status !== 'Resolved').length,
    underReview: tickets.filter(t => t.status === 'Under Review').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Top Banner / Student Anonymous Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-400 text-xs font-mono font-semibold mb-2">
            <Lock className="w-3 h-3" />
            <span>STUDENT ANONYMOUS ID: #CP-8841 • Active Token 7820-A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Grievance &amp; Suggestion Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time status tracking, community consensus clustering, and resolution audits.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center space-x-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => navigateTo('submit')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-sm hover:shadow-glow flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Complaint</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

        {/* Card 1 */}
        <div className="p-5 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>TOTAL FILED</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{tickets.length}</div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">
            +2 this semester
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>IN PROGRESS</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{counts.inProgress}</div>
          <p className="text-[11px] text-slate-400 mt-2">
            Active Engineering Triage
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>RESOLVED</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{counts.resolved}</div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">
            21.5% faster than avg
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl bg-[#111726] border border-[#1f293d] shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>AVG RESOLUTION TIME</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">4.2 <span className="text-sm font-sans font-normal text-slate-400">days</span></div>
          <p className="text-[11px] text-blue-400 mt-2">
            1.8 days faster than campus avg
          </p>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#101726] border border-[#1f293d] space-y-4">

        {/* Tabs Row */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-800">
          {[
            { id: 'All', label: `All (${counts.all})` },
            { id: 'Active', label: `Active (${counts.active})` },
            { id: 'Under Review', label: `Under Review (${counts.underReview})` },
            { id: 'In Progress', label: `In Progress (${counts.inProgress})` },
            { id: 'Resolved', label: `Resolved (${counts.resolved})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-glow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword or ticket ID..."
              className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="All Categories">All Categories</option>
              <option value="Sanitation">Sanitation &amp; Facilities</option>
              <option value="Infrastructure">Infrastructure &amp; Safety</option>
              <option value="Academics">Academics &amp; Faculty</option>
              <option value="Student Services">Student Services &amp; Dining</option>
              <option value="IT & Network">IT &amp; Network Operations</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="Any Priority">Any Priority</option>
              <option value="Urgent">Urgent Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="Recently Updated">Sort: Recently Updated</option>
              <option value="Most Upvoted">Sort: Most Upvoted</option>
              <option value="Urgent First">Sort: Highest Priority</option>
            </select>
          </div>
        </div>

      </div>

      {/* Ticket List Cards */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#101726] border border-slate-800 text-slate-400">
            <FileText className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No complaints matching your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing some filter criteria or search queries.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-6 rounded-2xl bg-[#101726] border border-[#1f293d] hover:border-blue-500/50 hover:shadow-glow-sm transition-all relative group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                {/* Content */}
                <div
                  onClick={() => navigateTo('ticket-detail', ticket.id)}
                  className="flex-1 cursor-pointer"
                >
                  {/* Badges line */}
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {ticket.category}
                    </span>

                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${ticket.priority === 'Urgent'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : ticket.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                      {ticket.priority}
                    </span>

                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${ticket.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : ticket.status === 'In Progress'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : ticket.status === 'Under Review'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-300'
                      }`}>
                      {ticket.status}
                    </span>

                    <span className="text-xs font-mono font-bold text-slate-400">
                      Ticket #{ticket.id}
                    </span>

                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {ticket.location}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {ticket.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {ticket.description}
                  </p>

                  {/* Metadata: Subordinates & Assigned Dept */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    {ticket.subordinatesCount > 0 ? (
                      <span className="flex items-center space-x-1.5 text-amber-400 font-medium">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Subordinate Group: {ticket.subordinatesCount} student reports merged</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-slate-500">
                        <span>Single Report</span>
                      </span>
                    )}

                    <span className="text-slate-700">|</span>

                    <span className="flex items-center space-x-1.5 text-slate-300">
                      <span>🛠</span>
                      <span>Assigned: {ticket.assignedDept}</span>
                    </span>
                  </div>
                </div>

                {/* Right Action: Upvote Button & Arrow */}
                <div className="flex items-center space-x-3 self-end lg:self-center">
                  <button
                    onClick={() => toggleUpvote(ticket.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 ${ticket.hasUpvoted
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-glow-sm'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${ticket.hasUpvoted ? 'fill-blue-400 text-blue-400' : ''}`} />
                    <span>+{ticket.upvotes} Upvotes</span>
                  </button>

                  <button
                    onClick={() => navigateTo('ticket-detail', ticket.id)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                    title="View Ticket Details"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-4">
        <span>Showing 1-{filteredTickets.length} of {tickets.length} complaints</span>
        <div className="flex items-center space-x-1">
          <button className="px-3 py-1.5 rounded bg-blue-600 text-white font-bold">1</button>
          <button className="px-3 py-1.5 rounded bg-slate-900 text-slate-400 hover:text-white">2</button>
          <button className="px-3 py-1.5 rounded bg-slate-900 text-slate-400 hover:text-white">3</button>
          <button className="px-3 py-1.5 rounded bg-slate-900 text-slate-400 hover:text-white">Next &gt;</button>
        </div>
      </div>

    </div>
  );
}
