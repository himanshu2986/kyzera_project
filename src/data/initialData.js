// Kyzera initial data - configured for clean user entry (starts with 0 complaints)
// Complaints and suggestions are dynamically added by verified users in real time.

export const INITIAL_TICKETS = [];

export const INITIAL_CLUSTERS = [];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-901',
    timestamp: 'Nov 10, 2024 • 10:14 AM',
    requester: 'Prof. David Tan (Teacher & Maintenance Lead)',
    ticketId: 'CP-4011',
    ticketTitle: 'Emergency Electrical Service Authorization',
    justification: 'Immediate life-safety compliance: Electrical short requires emergency inspection clearance.',
    status: 'Approved & Signed',
    facultySignOff: 'Dual-Faculty Review (Prof. Tan & Prof. Jenkins)',
    hash: '0x7b4a209e8f1c834a5d1290bb34e12fa',
    revealedStudent: 'Aditya Sharma (Roll #2022-CS-041)'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Verified Campus Node Connected',
    desc: 'You are securely connected to Kyzera Campus Network.',
    time: 'Just now',
    read: false
  }
];

export const INITIAL_LIVE_STREAM = [];

export const PRESET_USERS = {
  student: {
    email: 'a.sharma@kyzera.edu',
    name: 'Aditya Sharma',
    role: 'Student',
    anonymousId: 'Anonymous Student #CP-8841',
    token: '7820-A',
    department: 'School of Computer Science & Engineering',
    year: 'Class of 2026',
    roll: '2022-CS-041',
    dorm: 'Hostel Block C, Room 312',
    verified: true
  },
  admin: {
    email: 'prof.tan@kyzera.edu',
    name: 'Prof. David Tan',
    role: 'Admin / Teacher',
    title: 'Senior Faculty & Facilities Committee Lead',
    department: 'Kyzera Physical Infrastructure & Engineering Faculty',
    verified: true
  }
};
