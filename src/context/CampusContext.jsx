import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_TICKETS,
  INITIAL_CLUSTERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_LIVE_STREAM,
  USERS
} from '../data/initialData';
import { sha256, generateAnonymousId } from '../utils/crypto';

const CampusContext = createContext();

export function CampusProvider({ children }) {
  // Navigation
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTicketId, setSelectedTicketId] = useState('CP-4029');
  const [selectedClusterId, setSelectedClusterId] = useState('CL-882');

  // Auth & Roles
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kyzera_user');
    return saved ? JSON.parse(saved) : USERS.student;
  });

  // State with LocalStorage fallbacks
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('kyzera_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [clusters, setClusters] = useState(() => {
    const saved = localStorage.getItem('kyzera_clusters');
    return saved ? JSON.parse(saved) : INITIAL_CLUSTERS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('kyzera_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [liveStream, setLiveStream] = useState(INITIAL_LIVE_STREAM);
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('kyzera_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('kyzera_clusters', JSON.stringify(clusters));
  }, [clusters]);

  useEffect(() => {
    localStorage.setItem('kyzera_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('kyzera_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Navigation Helper
  const navigateTo = (page, id = null) => {
    if (page === 'ticket-detail' && id) {
      setSelectedTicketId(id);
    }
    if (page === 'duplicate-cluster' && id) {
      setSelectedClusterId(id);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch role between Student, Chief Admin, Ethics Officer
  const switchRole = (roleKey) => {
    const user = USERS[roleKey] || USERS.student;
    setCurrentUser(user);
    showToast(`Switched active persona to ${user.name} (${user.role})`, 'info');
  };

  // Upvote Action
  const toggleUpvote = (ticketId) => {
    setTickets(prev =>
      prev.map(ticket => {
        if (ticket.id === ticketId) {
          const isUpvoted = ticket.hasUpvoted;
          const delta = isUpvoted ? -1 : 1;
          const updated = {
            ...ticket,
            upvotes: ticket.upvotes + delta,
            hasUpvoted: !isUpvoted
          };
          showToast(
            !isUpvoted
              ? `You upvoted ticket #${ticketId}. Community momentum increased!`
              : `Removed upvote from #${ticketId}.`,
            !isUpvoted ? 'success' : 'info'
          );
          return updated;
        }
        return ticket;
      })
    );
  };

  // Add new Ticket
  const addTicket = async (ticketData) => {
    const newId = `CP-${Math.floor(4035 + Math.random() * 500)}`;
    const studentId = currentUser.anonymousId || generateAnonymousId();
    const token = `${Math.floor(1000 + Math.random() * 9000)}-${['A', 'B', 'C', 'X'][Math.floor(Math.random() * 4)]}`;

    const newTicket = {
      id: newId,
      title: ticketData.title,
      category: ticketData.category || 'Hostel Facilities',
      priority: ticketData.priority || 'Urgent',
      status: 'Under Review',
      location: ticketData.location || 'Campus Main Grounds',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      studentId: studentId.replace('Anonymous Student ', ''),
      token,
      isAnonymous: ticketData.isAnonymous ?? true,
      upvotes: 1,
      hasUpvoted: true,
      clusterId: ticketData.clusterId || null,
      subordinatesCount: 0,
      assignedDept: ticketData.category === 'Hostel Facilities' || ticketData.category === 'Sanitation & Facilities'
        ? 'Kyzera Facilities & Sanitation Division'
        : ticketData.category === 'IT & Network'
        ? 'Campus IT Network Operations'
        : 'Student Affairs & Campus Support',
      lead: 'Pending Administrative Assignment',
      liaison: 'Prof. Sarah Jenkins - Student Affairs Oversight Liaison',
      slaTotalHours: ticketData.priority === 'Urgent' ? 24 : 48,
      slaRemainingHours: ticketData.priority === 'Urgent' ? 24 : 48,
      description: ticketData.description,
      evidence: ticketData.evidence || [],
      roadmap: [
        {
          step: 1,
          title: 'Submitted',
          date: 'Just now',
          desc: 'Complaint verified & cryptographically hashed under Kyzera Privacy Shield.',
          status: 'completed'
        },
        {
          step: 2,
          title: 'AI Categorized & Clustered',
          date: 'Just now',
          desc: `Categorized as ${ticketData.category}. Neural triage confidence 97.8%.`,
          status: 'completed'
        },
        {
          step: 3,
          title: 'Under Review by Dept',
          date: 'In Queue',
          desc: 'Awaiting engineer assignment within SLA.',
          status: 'active'
        },
        {
          step: 4,
          title: 'Resolution & Sign-Off',
          date: 'Pending',
          desc: 'Verification and closure sign-off.',
          status: 'pending'
        }
      ],
      comments: []
    };

    setTickets(prev => [newTicket, ...prev]);

    // Add to live stream ticker
    setLiveStream(prev => [
      {
        id: `ls-${Date.now()}`,
        text: `New Ticket #${newId}: ${ticketData.title.slice(0, 32)}...`,
        sub: `Location: ${ticketData.location}`,
        status: 'JUST FILED',
        color: 'blue'
      },
      ...prev.slice(0, 5)
    ]);

    showToast(`Ticket #${newId} successfully filed and hashed anonymously!`, 'success');
    navigateTo('ticket-detail', newId);
    return newTicket;
  };

  // Admin: Update Status
  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const updatedRoadmap = t.roadmap.map(step => {
            if (newStatus === 'Resolved') {
              return { ...step, status: 'completed' };
            }
            if (newStatus === 'In Progress' && step.title.includes('In Progress')) {
              return { ...step, status: 'active' };
            }
            return step;
          });

          return {
            ...t,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            roadmap: updatedRoadmap,
            slaRemainingHours: newStatus === 'Resolved' ? 0 : t.slaRemainingHours
          };
        }
        return t;
      })
    );
    showToast(`Ticket #${ticketId} status updated to: ${newStatus}`, 'success');
  };

  // Add Comment to Ticket
  const addComment = (ticketId, text) => {
    if (!text.trim()) return;
    const authorName = currentUser.role === 'Student'
      ? currentUser.anonymousId
      : `${currentUser.name} (${currentUser.title || currentUser.role})`;

    const comment = {
      id: `c-${Date.now()}`,
      author: authorName,
      role: currentUser.role,
      time: 'Just now',
      text
    };

    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            comments: [...(t.comments || []), comment]
          };
        }
        return t;
      })
    );
    showToast('Comment posted successfully.', 'info');
  };

  // Mark Cluster Resolved
  const markClusterResolved = (clusterId) => {
    setClusters(prev =>
      prev.map(c => (c.id === clusterId ? { ...c, status: 'Resolved' } : c))
    );
    setTickets(prev =>
      prev.map(t => (t.clusterId === clusterId ? { ...t, status: 'Resolved' } : t))
    );
    showToast(`Cluster #${clusterId} and all merged tickets marked Resolved!`, 'success');
  };

  // Request Identity Reveal (Privacy Audit Protocol)
  const requestIdentityReveal = async (ticketId, justification, facultySigner1, facultySigner2) => {
    const ticket = tickets.find(t => t.id === ticketId);
    const hash = await sha256(`${ticketId}-${justification}-${Date.now()}`);
    const shortHash = `0x${hash.slice(0, 14)}...${hash.slice(-4)}`;

    const newLog = {
      id: `AUD-${Math.floor(905 + Math.random() * 95)}`,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }) + ` • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      requester: `${currentUser.name} (${currentUser.role})`,
      ticketId,
      ticketTitle: ticket ? ticket.title : 'Emergency Incident',
      justification,
      status: 'Approved & Signed',
      facultySignOff: `Dual-Signed (${facultySigner1} & ${facultySigner2})`,
      hash: shortHash,
      revealedStudent: 'Aditya Sharma (Roll #2022-CS-041 • Hostel C Rm 312)'
    };

    setAuditLogs(prev => [newLog, ...prev]);
    showToast('Dual-Faculty Authorization verified. Identity revealed under Audit Ledger.', 'warning');
    return newLog;
  };

  // Emergency Broadcast
  const broadcastEmergency = (title, message, severity = 'Urgent') => {
    const alert = {
      id: `EB-${Date.now()}`,
      title,
      message,
      severity,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setEmergencyAlert(alert);
    showToast(`EMERGENCY BROADCAST SENT TO ALL STUDENTS: ${title}`, 'error');
  };

  const dismissEmergency = () => {
    setEmergencyAlert(null);
  };

  return (
    <CampusContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedTicketId,
        setSelectedTicketId,
        selectedClusterId,
        setSelectedClusterId,
        currentUser,
        setCurrentUser,
        switchRole,
        tickets,
        setTickets,
        clusters,
        auditLogs,
        notifications,
        liveStream,
        emergencyAlert,
        toasts,
        showToast,
        removeToast,
        toggleUpvote,
        addTicket,
        updateTicketStatus,
        addComment,
        markClusterResolved,
        requestIdentityReveal,
        broadcastEmergency,
        dismissEmergency
      }}
    >
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
}

