// Kyzera seed data - aligned with Problem Statement 04 requirements:
// 1. Verified Access
// 2. Complaint Submission
// 3. Intelligent Classification (Infrastructure, Sanitation, Academics, Student Services, IT, Electrical)
// 4. Duplicate Detection & Recurring Issues
// 5. Priority Detection (Urgent, High, Medium, Low)
// 6. Admin Dashboard
// 7. Status Tracking (Submitted, Under Review, In Progress, Resolved)
// 8. Privacy and Accountability (Identity hiding + access audit record)

export const INITIAL_TICKETS = [
  {
    id: 'CP-4029',
    title: 'Hostel Block C water supply interrupted daily at 6 AM',
    category: 'Sanitation & Facilities',
    priority: 'Urgent',
    status: 'In Progress',
    location: 'Hostel Block C, Floors 2-5',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    studentId: 'CP-8841',
    token: '7820-A',
    isAnonymous: true,
    upvotes: 56,
    hasUpvoted: false,
    clusterId: 'CL-882',
    subordinatesCount: 34,
    assignedDept: 'Facilities & Sanitation Division',
    lead: 'Eng. David Tan - Chief Maintenance Lead',
    liaison: 'Prof. Sarah Jenkins - Student Affairs Oversight Liaison',
    slaTotalHours: 48,
    slaRemainingHours: 12,
    description: 'Since Monday Nov 10th, the primary overhead water booster pump for Block C fails to activate during peak morning preparation hours (06:00 AM - 07:30 AM). Over 180 residents are unable to use restrooms or shower before classes. Multiple resident assistants have lodged verbal requests with no progress.',
    evidence: [
      { name: 'pump_leak_photo.jpg', size: '2.1 MB', type: 'image/jpeg' },
      { name: 'valve_gauge_burst.jpg', size: '1.8 MB', type: 'image/jpeg' }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Submitted',
        date: 'Nov 10, 07:14 AM',
        desc: 'Complaint verified via @kyzera.edu and cryptographically hashed via SHA-256.',
        status: 'completed'
      },
      {
        step: 2,
        title: 'AI Classified & Clustered',
        date: 'Nov 10, 07:15 AM',
        desc: 'Neural engine classified under Sanitation & Facilities; merged 34 duplicate tickets into Cluster #CL-882.',
        status: 'completed'
      },
      {
        step: 3,
        title: 'Under Review by Dept',
        date: 'Nov 10, 09:30 AM',
        desc: 'Chief Facilities Engineer Eng. David Tan acknowledged receipt and reviewed pressure telemetry.',
        status: 'completed'
      },
      {
        step: 4,
        title: 'In Progress / Work Order #5821',
        date: 'Nov 10, 01:00 PM',
        desc: 'Plumbing and electrical crew dispatched with replacement 40A switchgear relay.',
        status: 'active'
      },
      {
        step: 5,
        title: 'Resolved',
        date: 'Pending',
        desc: 'Student public confirmation vote and physical inspection sign-off.',
        status: 'pending'
      }
    ],
    comments: [
      {
        id: 'c1',
        author: 'Anonymous Student #CP-3104',
        role: 'Resident',
        time: '1 day ago',
        text: 'Confirmed, 4th floor has zero pressure right now. It takes 15 minutes just to fill a bucket.'
      },
      {
        id: 'c2',
        author: 'Eng. David Tan',
        role: 'Chief Maintenance Lead',
        time: '5 hours ago',
        text: 'Parts have arrived from central warehouse. Technicians are on the roof adjusting the pressure sensor.'
      }
    ]
  },
  {
    id: 'CP-4032',
    title: 'Dormitory 4 High-Speed Wi-Fi Disruption during study hours',
    category: 'IT & Network',
    priority: 'High',
    status: 'In Progress',
    location: 'Dormitory 4, West Wing',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    studentId: 'CP-5219',
    token: '3410-B',
    isAnonymous: true,
    upvotes: 124,
    hasUpvoted: true,
    clusterId: 'CL-870',
    subordinatesCount: 18,
    assignedDept: 'Campus IT Network Operations',
    lead: 'Alex Rivera - Senior Network Admin',
    liaison: 'Prof. Mark Vance - CS Dept Rep',
    slaTotalHours: 24,
    slaRemainingHours: 8,
    description: 'AP 14 Signal degradation during peak study hours. Router power drop at AP1 causes students in rooms 201-220 to repeatedly lose connection during online exams.',
    evidence: [{ name: 'ping_packet_loss_chart.png', size: '1.2 MB', type: 'image/png' }],
    roadmap: [
      { step: 1, title: 'Submitted', date: 'Yesterday, 08:30 PM', desc: 'Ticket logged.', status: 'completed' },
      { step: 2, title: 'AI Clustered', date: 'Yesterday, 08:32 PM', desc: 'Merged 18 reports.', status: 'completed' },
      { step: 3, title: 'In Progress', date: 'Today, 09:00 AM', desc: 'Tech on-site replacing access point hardware.', status: 'active' },
      { step: 4, title: 'Resolved', date: 'Pending', desc: 'Throughput verification test.', status: 'pending' }
    ],
    comments: []
  },
  {
    id: 'CP-4011',
    title: 'Broken ceiling fan regulator in Room B-204 causing sparks',
    category: 'Infrastructure & Safety',
    priority: 'Urgent',
    status: 'Under Review',
    location: 'Academic Block B, Rm 204',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    studentId: 'CP-8841',
    token: '7820-A',
    isAnonymous: true,
    upvotes: 24,
    hasUpvoted: false,
    clusterId: null,
    subordinatesCount: 3,
    assignedDept: 'Electrical & Infrastructure Maintenance',
    lead: 'Chief Electrician Sam Kowalski',
    liaison: 'Dr. Robert Chen - Chief Dean',
    slaTotalHours: 24,
    slaRemainingHours: 4,
    description: 'Switchboard on south wall emits visible sparks when position is adjusted from 2 to 3. Breaker has not tripped but smell of burnt insulation was noted during morning lecture.',
    evidence: [{ name: 'sparking_switch_box.jpg', size: '3.4 MB', type: 'image/jpeg' }],
    roadmap: [
      { step: 1, title: 'Submitted', date: 'Nov 8, 11:00 AM', desc: 'Logged with Urgent Safety flag.', status: 'completed' },
      { step: 2, title: 'Under Review', date: 'Nov 8, 11:05 AM', desc: 'Scheduled for electrical review at 3:00 PM today.', status: 'active' },
      { step: 3, title: 'Resolved', date: 'Pending', desc: 'Rewiring and regulator module replacement.', status: 'pending' }
    ],
    comments: []
  },
  {
    id: 'CP-3992',
    title: 'Central Cafeteria Gluten-Free Labeling & Allergen Markers',
    category: 'Student Services',
    priority: 'Low',
    status: 'Resolved',
    location: 'Central Dining Hall',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    studentId: 'CP-1903',
    token: '9921-X',
    isAnonymous: true,
    upvotes: 89,
    hasUpvoted: true,
    clusterId: null,
    subordinatesCount: 0,
    assignedDept: 'Student Services & Dining',
    lead: 'Chef Maria Santos',
    liaison: 'Student Nutrition Committee',
    slaTotalHours: 72,
    slaRemainingHours: 0,
    description: 'All allergen markers replaced with high-visibility color-coded cards verified by Student Union representatives. Kitchen staff trained on cross-contamination.',
    evidence: [{ name: 'new_menu_cards.jpg', size: '1.5 MB', type: 'image/jpeg' }],
    roadmap: [
      { step: 1, title: 'Submitted', date: '5 days ago', desc: 'Logged by student.', status: 'completed' },
      { step: 2, title: 'Under Review', date: '4 days ago', desc: 'Dietary signs updated.', status: 'completed' },
      { step: 3, title: 'Resolved', date: 'Today, 2 hrs ago', desc: '100% Student Approved and signed off.', status: 'completed' }
    ],
    comments: []
  },
  {
    id: 'CP-3965',
    title: 'Operating Systems Midterm Grading Rubric Discrepancy',
    category: 'Academics',
    priority: 'Medium',
    status: 'In Progress',
    location: 'School of Computing, Department Office',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    studentId: 'CP-8841',
    token: '7820-A',
    isAnonymous: true,
    upvotes: 48,
    hasUpvoted: true,
    clusterId: null,
    subordinatesCount: 11,
    assignedDept: 'Academic Affairs & Course Coordination',
    lead: 'Prof. Mark Vance - Department Chair',
    liaison: 'Academic Grievance Council',
    slaTotalHours: 48,
    slaRemainingHours: 16,
    description: 'Question 3(b) had two conflicting requirements in the problem specification. TAs deducted 10 points inconsistently across section A and B.',
    evidence: [{ name: 'rubric_comparison.pdf', size: '0.8 MB', type: 'application/pdf' }],
    roadmap: [
      { step: 1, title: 'Submitted', date: '3 days ago', desc: 'Reported by CS students.', status: 'completed' },
      { step: 2, title: 'Under Review', date: '2 days ago', desc: 'Faculty committee convened.', status: 'completed' },
      { step: 3, title: 'In Progress', date: 'Yesterday', desc: 'Regrading with standardized rubric across all sections.', status: 'active' },
      { step: 4, title: 'Resolved', date: 'Pending', desc: 'Final grade adjustments posted on LMS.', status: 'pending' }
    ],
    comments: []
  },
  {
    id: 'CP-3950',
    title: 'Library Wi-Fi drops every evening during study hours (7PM - 10PM)',
    category: 'IT & Network',
    priority: 'Medium',
    status: 'Resolved',
    location: 'Central Library, 3rd Fl North Wing',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    studentId: 'CP-8841',
    token: '7820-A',
    isAnonymous: true,
    upvotes: 142,
    hasUpvoted: true,
    clusterId: 'CL-870',
    subordinatesCount: 64,
    assignedDept: 'IT South Wing Operations',
    lead: 'Alex Rivera - Senior Network Admin',
    liaison: 'Head Librarian Mrs. Henderson',
    slaTotalHours: 48,
    slaRemainingHours: 0,
    description: 'Signal strength shows full bars but DHCP pool runs out of leases, causing continuous packet timeout during exam preparation rush.',
    evidence: [],
    roadmap: [
      { step: 1, title: 'Submitted', date: '8 days ago', desc: 'Reported by study hall group.', status: 'completed' },
      { step: 2, title: 'Under Review', date: '6 days ago', desc: 'Network telemetry analyzed.', status: 'completed' },
      { step: 3, title: 'In Progress', date: '3 days ago', desc: 'AP switch replaced and subnet IP lease pool expanded to /22.', status: 'completed' },
      { step: 4, title: 'Resolved', date: 'Yesterday', desc: 'Resolution verified by 64 student testers.', status: 'completed' }
    ],
    comments: []
  },
  {
    id: 'CP-3918',
    title: 'Cafeteria water cooler filter replacement overdue & red indicator',
    category: 'Sanitation & Facilities',
    priority: 'Low',
    status: 'Resolved',
    location: 'Student Union Food Court',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 1000).toISOString(),
    studentId: 'CP-8841',
    token: '7820-A',
    isAnonymous: true,
    upvotes: 31,
    hasUpvoted: false,
    clusterId: null,
    subordinatesCount: 9,
    assignedDept: 'Sanitation & Facilities Maintenance',
    lead: 'Eng. David Tan',
    liaison: 'Campus Health Board',
    slaTotalHours: 48,
    slaRemainingHours: 0,
    description: 'TDS indicator turned red on the dispenser next to Counter 4. Filter cartridge replacement tag indicated overdue expired last week.',
    evidence: [],
    roadmap: [
      { step: 1, title: 'Submitted', date: '14 days ago', desc: 'Logged by student.', status: 'completed' },
      { step: 2, title: 'Resolved', date: '5 days ago', desc: 'Double 5-micron sediment and carbon block filters replaced.', status: 'completed' }
    ],
    comments: []
  },
  {
    id: 'CP-3902',
    title: 'Main auditorium emergency exit door latch jammed',
    category: 'Infrastructure & Safety',
    priority: 'Urgent',
    status: 'Under Review',
    location: 'Main Auditorium, Exit 3',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    studentId: 'CP-6019',
    token: '4190-C',
    isAnonymous: true,
    upvotes: 43,
    hasUpvoted: false,
    clusterId: null,
    subordinatesCount: 5,
    assignedDept: 'Campus Safety & Physical Security',
    lead: 'Chief Officer Kevin Miller',
    liaison: 'Dr. Robert Chen - Chief Dean',
    slaTotalHours: 24,
    slaRemainingHours: 6,
    description: 'Panic crash bar on exit door 3 catches on the top door frame and will not push open without extreme force. Critical fire code hazard.',
    evidence: [],
    roadmap: [
      { step: 1, title: 'Submitted', date: '3 days ago', desc: 'Safety alert triggered.', status: 'completed' },
      { step: 2, title: 'Under Review', date: 'Today', desc: 'Emergency locksmith team dispatched.', status: 'active' }
    ],
    comments: []
  },
  {
    id: 'CP-3885',
    title: 'Late night campus shuttle bus delayed in South Gate',
    category: 'Student Services',
    priority: 'Medium',
    status: 'Resolved',
    location: 'South Gate Transit Hub',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 1000).toISOString(),
    studentId: 'CP-4402',
    token: '5512-T',
    isAnonymous: true,
    upvotes: 67,
    hasUpvoted: true,
    clusterId: null,
    subordinatesCount: 14,
    assignedDept: 'Campus Transportation Services',
    lead: 'Transit Supervisor Marcus Cole',
    liaison: 'Commuter Students Association',
    slaTotalHours: 48,
    slaRemainingHours: 0,
    description: '11:00 PM and 11:30 PM South Gate shuttles consistently arriving 30-45 minutes late, leaving students stranded outside campus boundaries at night.',
    evidence: [],
    roadmap: [
      { step: 1, title: 'Submitted', date: '9 days ago', desc: 'Reported by night class students.', status: 'completed' },
      { step: 2, title: 'Resolved', date: '3 days ago', desc: 'Additional relief bus added to schedule from 10:30 PM to 1:00 AM.', status: 'completed' }
    ],
    comments: []
  }
];

export const INITIAL_CLUSTERS = [
  {
    id: 'CL-882',
    title: 'Hostel Water Supply - Block C',
    category: 'Sanitation & Facilities',
    priority: 'Urgent',
    status: 'In Progress',
    reportsCount: 34,
    affectedCount: '180+ Residents',
    openDays: '2 Days',
    masterTicketId: 'CP-4029',
    masterTitle: 'Chronic Water Pressure Failure in Block C Booster Unit',
    confidenceScore: 94.4,
    aiSummary: '34 independent student reports with 94.4% semantic cosine similarity indicate recurring failure of overhead booster pump between 6:00 AM and 7:30 AM.',
    diagnostic: 'Telemetry analysis indicates failure of secondary switchboard relay during peak morning load from 06:00 AM. Direct root cause is worn relay switch #3 failing to trigger pump contactor.',
    recommendedAction: 'Pre-dispatch Plumber + Electrician team with replacement 40A Schneider relay and secondary pressure transducer.',
    subordinateReports: [
      { id: 'HC-3812', title: 'Hostel Block water pressure fault Mon-Wed', studentId: 'Anonymous Student #CP-3104', similarity: 92, time: 'Nov 10, 06:45 AM', snippet: 'No water on 3rd floor bathrooms since early morning.' },
      { id: 'HC-3790', title: 'No water on floors 3, 4 before 8am in morning', studentId: 'Anonymous Student #CP-5921', similarity: 89, time: 'Nov 10, 07:05 AM', snippet: 'Taps are bone dry before classes start.' },
      { id: 'HC-3742', title: 'Water pump noise and cutting sound in C wing', studentId: 'Anonymous Student #CP-1189', similarity: 81, time: 'Nov 09, 06:15 PM', snippet: 'Vibration and clicking sounds from pump room.' },
      { id: 'HC-3733', title: 'Low pressure in 4th floor shower stalls', studentId: 'Anonymous Student #CP-7712', similarity: 85, time: 'Nov 09, 07:20 AM', snippet: 'Pressure drops to a trickle every morning around 6:30.' },
      { id: 'HC-3720', title: 'Cold water completely off at 6:30am', studentId: 'Anonymous Student #CP-4044', similarity: 88, time: 'Nov 08, 06:30 AM', snippet: 'Overhead tank seems empty or booster pump is stopped.' },
      { id: 'HC-3699', title: 'Booster pump revving sound and zero flow', studentId: 'Anonymous Student #CP-2290', similarity: 83, time: 'Nov 08, 06:10 AM', snippet: 'Pump keeps cycling on and off every 10 seconds.' }
    ]
  },
  {
    id: 'CL-870',
    title: 'Library & Dormitory Wi-Fi Packet Drops',
    category: 'IT & Network',
    priority: 'Medium',
    status: 'In Progress',
    reportsCount: 18,
    affectedCount: '450+ Students',
    openDays: '1 Day',
    masterTicketId: 'CP-4032',
    masterTitle: 'Campus West Access Point Saturation & DHCP Depletion',
    confidenceScore: 91.8,
    aiSummary: '18 reports across Dorm 4 and Library West Wing sharing identical MAC-level disconnections during evening peak.',
    diagnostic: 'DHCP lease time of 24h causing lease exhaustion on /24 subnet when student devices double at 7:00 PM.',
    recommendedAction: 'Reduce DHCP lease duration to 4 hours and expand pool to /22 subnet.',
    subordinateReports: []
  },
  {
    id: 'CL-859',
    title: 'Escalator South Walkway Stalled',
    category: 'Infrastructure & Safety',
    priority: 'High',
    status: 'Under Review',
    reportsCount: 12,
    affectedCount: '800+ Commuters',
    openDays: '3 Days',
    masterTicketId: 'CP-3980',
    masterTitle: 'South Walkway Incline Escalator Emergency Brake Lock',
    confidenceScore: 96.1,
    aiSummary: '12 reports regarding safety sensor lock on escalator tread #4.',
    diagnostic: 'Step chain tension sensor triggered false positive obstruction flag.',
    recommendedAction: 'Recalibrate tension switch and perform safety brake test.',
    subordinateReports: []
  },
  {
    id: 'CL-844',
    title: 'Overdue Water Cooler Filters',
    category: 'Sanitation & Facilities',
    priority: 'Low',
    status: 'Resolved',
    reportsCount: 9,
    affectedCount: 'Campus Wide',
    openDays: 'Resolved',
    masterTicketId: 'CP-3918',
    masterTitle: 'Quarterly Water Dispenser Cartridge Expiry Across Quad',
    confidenceScore: 89.2,
    aiSummary: '9 reports flagged red TDS filter warning lights.',
    diagnostic: 'Routine 90-day replacement cycle overdue by 11 days.',
    recommendedAction: 'Execute batch filter change across 14 campus water coolers.',
    subordinateReports: []
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-901',
    timestamp: 'Nov 10, 2024 • 10:14 AM',
    requester: 'Dr. Robert Chen (Chief Dean)',
    ticketId: 'CP-4011',
    ticketTitle: 'Broken ceiling fan regulator causing sparks',
    justification: 'Immediate life-safety issue: Electrical short requires room access and student verification.',
    status: 'Approved & Signed',
    facultySignOff: 'Dual-Signed (Dr. Chen & Prof. Jenkins)',
    hash: '0x7b4a209e8f1c834a5d1290bb34e12fa',
    revealedStudent: 'Aditya Sharma (Roll #2022-CS-041)'
  },
  {
    id: 'AUD-884',
    timestamp: 'Nov 08, 2024 • 02:40 PM',
    requester: 'Maria Ortiz (Safety Officer)',
    ticketId: 'CP-3902',
    ticketTitle: 'Main auditorium emergency exit door latch jammed',
    justification: 'Life Safety Code 101 Compliance: Physical inspection and verification of witness statement.',
    status: 'Approved & Signed',
    facultySignOff: 'Dual-Signed (M. Ortiz & Dr. Chen)',
    hash: '0x4c219a77e81b239f041280cc124b88a',
    revealedStudent: 'Rohan Gupta (Roll #2023-ME-112)'
  },
  {
    id: 'AUD-871',
    timestamp: 'Nov 05, 2024 • 11:15 AM',
    requester: 'Kevin Miller (Campus Police)',
    ticketId: 'CP-3881',
    ticketTitle: 'Equipment theft report in Physics Lab 3',
    justification: 'Active Criminal Investigation clearance under Campus Safety Protocol Sec 9.',
    status: 'Approved & Signed',
    facultySignOff: 'Dual-Signed (K. Miller & Dean Chen)',
    hash: '0x9e12bf405528ca71192084aa901c33d',
    revealedStudent: 'Priya Patel (Roll #2021-PH-088)'
  },
  {
    id: 'AUD-860',
    timestamp: 'Nov 02, 2024 • 09:20 AM',
    requester: 'Marcus Vance (Student Union Rep)',
    ticketId: 'CP-3860',
    ticketTitle: 'Cafeteria pricing protest note',
    justification: 'Requesting student identity to invite them to student union council hearing.',
    status: 'Denied (Non-Compliant)',
    facultySignOff: 'Rejected by Ethics Board',
    hash: '0x1f88c399042b8214fa883011ee22e49',
    revealedStudent: null
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Work Order #5821 Dispatched',
    desc: 'Facilities technicians are on-site for Ticket #CP-4029 (Hostel C Water).',
    time: '25m ago',
    read: false,
    ticketId: 'CP-4029'
  },
  {
    id: 'n2',
    title: 'Duplicate Reports Merged',
    desc: '34 reports merged into Cluster #CL-882. Priority elevated to Urgent.',
    time: '2h ago',
    read: false,
    ticketId: 'CP-4029'
  },
  {
    id: 'n3',
    title: 'Resolution Verified',
    desc: 'Central Cafeteria Gluten-Free labeling confirmed complete by Student Union.',
    time: '1d ago',
    read: true,
    ticketId: 'CP-3992'
  }
];

export const INITIAL_LIVE_STREAM = [
  { id: 'ls1', text: 'Hostel B Water Pump Replaced', sub: 'High pressure restored to Block B West Wing', status: 'RESOLVED 15M AGO', color: 'emerald' },
  { id: 'ls2', text: 'Library LF-02 Wi-Fi Router Upgraded', sub: 'Replaced defective AP hardware with low-latency switch', status: 'RESOLVED 1H AGO', color: 'emerald' },
  { id: 'ls3', text: 'Operating Systems Midterm Regrading', sub: 'Updated grading rubric applied to Section A & B', status: 'IN PROGRESS 1H AGO', color: 'amber' },
  { id: 'ls4', text: 'Central Cafeteria Allergen Labels Verified', sub: 'Certified by Student Union & Health Board', status: 'RESOLVED 2H AGO', color: 'emerald' },
  { id: 'ls5', text: 'SciBlock C Hallway Floor Cleaned', sub: 'Hazard cones removed and slip risk addressed', status: 'RESOLVED 3H AGO', color: 'emerald' }
];

export const USERS = {
  student: {
    email: 'a.sharma@kyzera.edu',
    name: 'Aditya Sharma',
    role: 'Student',
    anonymousId: 'Anonymous Student #CP-8841',
    token: '7820-A',
    department: 'School of Computer Science & Engineering',
    year: 'Class of 2026',
    verified: true
  },
  admin: {
    email: 'eng.tan@kyzera.edu',
    name: 'Eng. David Tan',
    role: 'Chief Admin',
    title: 'Chief Maintenance Lead, Facilities Dept',
    department: 'Kyzera Physical Infrastructure & Facilities',
    verified: true
  },
  ethics: {
    email: 'dean.chen@kyzera.edu',
    name: 'Dr. Robert Chen',
    role: 'Ethics Officer',
    title: 'Dean of Student Affairs & Governance Ethics Chair',
    department: 'University Oversight Board',
    verified: true
  }
};
