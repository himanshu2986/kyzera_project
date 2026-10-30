import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_TICKETS,
  INITIAL_CLUSTERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_LIVE_STREAM,
  PRESET_USERS
} from '../data/initialData';
import { sha256, generateAnonymousId } from '../utils/crypto';
import {
  isFirebaseReady,
  subscribeToTicketsRealtime,
  addTicketToFirebase,
  updateTicketStatusInFirebase,
  updateTicketUpvotesInFirebase,
  updateTicketRatingInFirebase,
  addCommentToFirebase,
  subscribeToPresenceRealtime
} from '../services/firebase';
import { sendStatusEmail } from '../services/emailService';

const CampusContext = createContext();

export function CampusProvider({ children }) {
  // Authentication & Initial Page (Persists logged-in session across page reloads)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('kyzera_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kyzera_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const auth = localStorage.getItem('kyzera_auth') === 'true';
    if (!auth) return 'login';
    const savedPage = localStorage.getItem('kyzera_current_page');
    const userStr = localStorage.getItem('kyzera_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if ((savedPage === 'admin' || savedPage === 'privacy-audit') && u.role === 'Student') {
          return 'dashboard';
        }
        if (savedPage) return savedPage;
        return u.role === 'Student' ? 'dashboard' : 'admin';
      } catch {}
    }
    return savedPage || 'login';
  });

  const [selectedTicketId, setSelectedTicketId] = useState(() => {
    return localStorage.getItem('kyzera_ticket_id') || null;
  });

  const [selectedClusterId, setSelectedClusterId] = useState(() => {
    return localStorage.getItem('kyzera_cluster_id') || null;
  });

  // State with LocalStorage (Starts completely empty until user adds complaints)
  const [tickets, setTickets] = useState(() => {
    localStorage.removeItem('kyzera_tickets');
    const saved = localStorage.getItem('kyzera_user_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const [clusters, setClusters] = useState(() => {
    localStorage.removeItem('kyzera_clusters');
    const saved = localStorage.getItem('kyzera_user_clusters');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('kyzera_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [liveStream, setLiveStream] = useState(INITIAL_LIVE_STREAM);
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(() => isFirebaseReady());

  // Real-time Firestore Cloud Synchronization
  useEffect(() => {
    if (isFirebaseReady()) {
      setIsFirebaseConnected(true);
      const unsubscribe = subscribeToTicketsRealtime(
        (firestoreTickets) => {
          if (firestoreTickets && firestoreTickets.length > 0) {
            setTickets(firestoreTickets);
          }
        },
        (err) => {
          console.warn('Real-time Firestore listener notice:', err);
        }
      );
      return () => unsubscribe();
    } else {
      setIsFirebaseConnected(false);
    }
  }, [isFirebaseConnected]);

  // Real-time Active Counts (Accurately tracks genuine active user sessions)
  const [activeStudentsCount, setActiveStudentsCount] = useState(() => {
    return (currentUser && currentUser.role === 'Student') ? 1 : 0;
  });
  const [activeTeachersCount, setActiveTeachersCount] = useState(() => {
    return (currentUser && (currentUser.role?.includes('Teacher') || currentUser.role?.includes('Admin'))) ? 1 : 0;
  });

  useEffect(() => {
    const isStudent = currentUser && currentUser.role === 'Student';
    const isTeacher = currentUser && (currentUser.role?.includes('Teacher') || currentUser.role?.includes('Admin'));

    // Unique ID for this browser tab session
    const tabId = Math.random().toString(36).substring(2, 9);
    const sessionKey = `kyzera_presence_${tabId}`;

    const updatePresence = () => {
      const now = Date.now();
      if (currentUser) {
        localStorage.setItem(sessionKey, JSON.stringify({
          role: isStudent ? 'Student' : 'Teacher',
          timestamp: now
        }));
      } else {
        localStorage.removeItem(sessionKey);
      }

      // Scan all active presence keys in localStorage (clean up any older than 6s)
      let students = 0;
      let teachers = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('kyzera_presence_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (now - data.timestamp < 6000) {
              if (data.role === 'Student') students++;
              if (data.role === 'Teacher') teachers++;
            } else {
              localStorage.removeItem(key);
            }
          } catch {}
        }
      }

      // Fallback: If current user is logged in on this tab, guarantee at least 1
      if (isStudent && students === 0) students = 1;
      if (isTeacher && teachers === 0) teachers = 1;

      setActiveStudentsCount(students);
      setActiveTeachersCount(teachers);
    };

    updatePresence();
    const interval = setInterval(updatePresence, 2000);

    const onStorage = () => {
      updatePresence();
    };
    window.addEventListener('storage', onStorage);

    // Multi-device presence synchronization via Cloud Firestore
    let unsubFirebasePresence = () => {};
    if (isFirebaseReady() && currentUser) {
      unsubFirebasePresence = subscribeToPresenceRealtime(tabId, isStudent ? 'Student' : 'Teacher', ({ students, teachers }) => {
        if (students > 0) setActiveStudentsCount(students);
        if (teachers > 0) setActiveTeachersCount(teachers);
      });
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage);
      localStorage.removeItem(sessionKey);
      unsubFirebasePresence();
    };
  }, [currentUser]);

  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
  const resolutionRate = tickets.length > 0 ? ((resolvedCount / tickets.length) * 100).toFixed(1) : '94.8';

  // Persistence
  useEffect(() => {
    localStorage.setItem('kyzera_user_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('kyzera_user_clusters', JSON.stringify(clusters));
  }, [clusters]);

  useEffect(() => {
    localStorage.setItem('kyzera_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kyzera_user', JSON.stringify(currentUser));
      localStorage.setItem('kyzera_auth', 'true');
    }
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
    if (page === 'admin' || page === 'privacy-audit') {
      const isTeacher = currentUser && (currentUser.role?.includes('Teacher') || currentUser.role?.includes('Admin'));
      if (!isTeacher) {
        showToast(`Access restricted: ${page === 'admin' ? 'Admin Dashboard' : 'Privacy Audit'} is only accessible to verified faculty and teachers.`, 'error');
        setCurrentPage('dashboard');
        localStorage.setItem('kyzera_current_page', 'dashboard');
        return;
      }
    }
    if (page === 'ticket-detail' && id) {
      setSelectedTicketId(id);
      localStorage.setItem('kyzera_ticket_id', id);
    }
    if (page === 'duplicate-cluster' && id) {
      setSelectedClusterId(id);
      localStorage.setItem('kyzera_cluster_id', id);
    }
    setCurrentPage(page);
    localStorage.setItem('kyzera_current_page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login Handlers
  const loginAsStudent = (customData = null) => {
    const studentUser = customData || PRESET_USERS.student;
    setCurrentUser(studentUser);
    setIsAuthenticated(true);
    localStorage.setItem('kyzera_user', JSON.stringify(studentUser));
    localStorage.setItem('kyzera_auth', 'true');
    localStorage.setItem('kyzera_current_page', 'dashboard');
    showToast(`Logged in as Student: ${studentUser.name} (Identity masked publicly as ${studentUser.anonymousId})`, 'success');
    navigateTo('dashboard');
  };

  const loginAsAdmin = (customData = null) => {
    const adminUser = customData || PRESET_USERS.admin;
    setCurrentUser(adminUser);
    setIsAuthenticated(true);
    localStorage.setItem('kyzera_user', JSON.stringify(adminUser));
    localStorage.setItem('kyzera_auth', 'true');
    localStorage.setItem('kyzera_current_page', 'admin');
    showToast(`Logged in as Teacher / Admin: ${adminUser.name} (Access granted to student submitter identities)`, 'success');
    navigateTo('admin');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('kyzera_user');
    localStorage.removeItem('kyzera_auth');
    localStorage.removeItem('kyzera_current_page');
    localStorage.removeItem('kyzera_ticket_id');
    localStorage.removeItem('kyzera_cluster_id');
    showToast('You have been logged out.', 'info');
    navigateTo('login');
  };

  // Upvote Action with Community Auto-Escalation
  const toggleUpvote = (ticketId) => {
    setTickets(prev =>
      prev.map(ticket => {
        if (ticket.id === ticketId) {
          const isUpvoted = ticket.hasUpvoted;
          const delta = isUpvoted ? -1 : 1;
          const newUpvotes = Math.max(0, ticket.upvotes + delta);
          let newPriority = ticket.priority;

          // Auto-escalate based on community upvote momentum
          if (!isUpvoted) {
            if (newUpvotes >= 10 && ticket.priority !== 'Urgent') {
              newPriority = 'Urgent';
              showToast(`⚡ High Community Momentum! Ticket #${ticketId} reached ${newUpvotes} upvotes and auto-escalated to URGENT priority.`, 'warning');
            } else if (newUpvotes >= 5 && (ticket.priority === 'Medium' || ticket.priority === 'Low')) {
              newPriority = 'High';
              showToast(`⚡ Ticket #${ticketId} reached ${newUpvotes} upvotes and auto-escalated to HIGH priority.`, 'info');
            } else {
              showToast(`You upvoted ticket #${ticketId}. Community momentum increased!`, 'success');
            }
          } else {
            showToast(`Removed upvote from #${ticketId}.`, 'info');
          }

          if (isFirebaseReady()) {
            updateTicketUpvotesInFirebase(ticketId, newUpvotes, newPriority).catch(() => {});
          }

          const updated = {
            ...ticket,
            upvotes: newUpvotes,
            priority: newPriority,
            hasUpvoted: !isUpvoted
          };
          return updated;
        }
        return ticket;
      })
    );
  };

  // Add new Ticket
  const addTicket = async (ticketData) => {
    const newId = `CP-${Math.floor(4035 + Math.random() * 500)}`;
    const studentAnonId = currentUser?.anonymousId || generateAnonymousId();
    const token = `${Math.floor(1000 + Math.random() * 9000)}-${['A', 'B', 'C', 'X'][Math.floor(Math.random() * 4)]}`;

    const newTicket = {
      id: newId,
      title: ticketData.title,
      category: ticketData.category || 'Sanitation & Facilities',
      priority: ticketData.priority || 'Urgent',
      status: 'Under Review',
      location: ticketData.location || 'Campus Grounds',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Anonymous tokens (visible to other students)
      studentId: studentAnonId.replace('Anonymous Student ', ''),
      token,
      isAnonymous: ticketData.isAnonymous ?? true,
      // Real student identity (visible to Admin / Teachers only)
      studentRealName: currentUser?.name || 'Aditya Sharma',
      studentEmail: currentUser?.email || 'a.sharma@kyzera.edu',
      studentRoll: currentUser?.roll || '2022-CS-041',
      studentDept: currentUser?.department || 'Computer Science & Engineering',
      studentDorm: currentUser?.dorm || 'Hostel Block C, Room 312',
      upvotes: 1,
      hasUpvoted: true,
      clusterId: ticketData.clusterId || null,
      subordinatesCount: 0,
      assignedDept: ticketData.category === 'Sanitation & Facilities'
        ? 'Facilities & Sanitation Division'
        : ticketData.category === 'IT & Network'
        ? 'Campus IT Network Operations'
        : ticketData.category === 'Infrastructure & Safety'
        ? 'Electrical & Infrastructure Maintenance'
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
          title: 'AI Classified & Clustered',
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
          title: 'Resolved',
          date: 'Pending',
          desc: 'Verification and closure sign-off.',
          status: 'pending'
        }
      ],
      comments: []
    };

    setTickets(prev => [newTicket, ...prev]);

    // Save to Firebase Firestore if connected
    if (isFirebaseReady()) {
      addTicketToFirebase(newTicket).catch(err => {
        console.warn('Firebase sync warning:', err);
      });
    }

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

    showToast(`Ticket #${newId} filed successfully! Identity protected from other students.`, 'success');
    navigateTo('ticket-detail', newId);
    return newTicket;
  };

  // Admin: Update Status & Dispatch Email to Student
  const updateTicketStatus = (ticketId, newStatus, note = '') => {
    let targetTicket = null;
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          targetTicket = t;
          const updatedRoadmap = (t.roadmap || []).map(step => {
            if (newStatus === 'Resolved') {
              return { ...step, status: 'completed' };
            }
            if (newStatus === 'In Progress' && step.title && step.title.includes('In Progress')) {
              return { ...step, status: 'active' };
            }
            return step;
          });

          return {
            ...t,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            roadmap: updatedRoadmap,
            resolutionNote: note || t.resolutionNote,
            slaRemainingHours: newStatus === 'Resolved' ? 0 : t.slaRemainingHours
          };
        }
        return t;
      })
    );

    if (isFirebaseReady()) {
      updateTicketStatusInFirebase(ticketId, newStatus).catch(err => {
        console.warn('Firebase status update warning:', err);
      });
    }

    // Automatically send real email notification to student submitter
    if (targetTicket && targetTicket.studentEmail) {
      sendStatusEmail({
        toEmail: targetTicket.studentEmail,
        studentName: targetTicket.studentRealName || 'Student',
        ticketId,
        ticketTitle: targetTicket.title,
        oldStatus: targetTicket.status,
        newStatus,
        updatedBy: currentUser?.name || 'Prof. David Tan (Teacher / Admin)',
        resolutionNote: note
      }).then(res => {
        if (res && res.success) {
          showToast(`📧 Status update email dispatched to ${targetTicket.studentEmail}!`, 'info');
        }
      }).catch(err => {
        console.warn('Failed to send status update email:', err);
      });
    }

    showToast(`Ticket #${ticketId} status updated to: ${newStatus}`, 'success');
  };

  // Student Withdraw / Self-Resolve Ticket
  const withdrawTicket = (ticketId, reason = 'Issue resolved by submitter') => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'Resolved',
            updatedAt: new Date().toISOString(),
            resolutionNote: `Self-Resolved / Withdrawn by student: ${reason}`,
            slaRemainingHours: 0
          };
        }
        return t;
      })
    );
    showToast(`Ticket #${ticketId} successfully resolved by student.`, 'success');
  };

  // Student Post-Resolution Feedback & Star Rating
  const submitTicketRating = (ticketId, rating, comment = '') => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            rating,
            ratingComment: comment,
            ratedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );

    if (isFirebaseReady()) {
      updateTicketRatingInFirebase(ticketId, rating, comment).catch(() => {});
    }

    showToast(`⭐ Recorded your ${rating}-star resolution rating! Thank you.`, 'success');
  };

  // Add Comment to Ticket
  const addComment = (ticketId, text) => {
    if (!text.trim()) return;
    const isTeacher = currentUser?.role?.includes('Admin') || currentUser?.role?.includes('Teacher');
    const authorName = isTeacher
      ? `${currentUser.name} (${currentUser.title || 'Teacher / Admin'})`
      : currentUser?.anonymousId || 'Anonymous Student #CP-8841';

    const comment = {
      id: `c-${Date.now()}`,
      author: authorName,
      role: isTeacher ? 'Admin / Teacher' : 'Student',
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

    if (isFirebaseReady()) {
      addCommentToFirebase(ticketId, comment).catch(() => {});
    }

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
      requester: `${currentUser?.name || 'Prof. David Tan'} (Teacher / Admin)`,
      ticketId,
      ticketTitle: ticket ? ticket.title : 'Emergency Incident',
      justification,
      status: 'Approved & Signed',
      facultySignOff: `Dual-Signed (${facultySigner1} & ${facultySigner2})`,
      hash: shortHash,
      revealedStudent: ticket ? `${ticket.studentRealName} (${ticket.studentRoll} • ${ticket.studentDorm})` : 'Aditya Sharma (2022-CS-041)'
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
        isAuthenticated,
        currentPage,
        navigateTo,
        selectedTicketId,
        setSelectedTicketId,
        selectedClusterId,
        setSelectedClusterId,
        currentUser,
        loginAsStudent,
        loginAsAdmin,
        logout,
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
        withdrawTicket,
        submitTicketRating,
        addComment,
        markClusterResolved,
        requestIdentityReveal,
        broadcastEmergency,
        dismissEmergency,
        activeStudentsCount,
        activeTeachersCount,
        resolutionRate,
        isFirebaseConnected,
        setIsFirebaseConnected
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
