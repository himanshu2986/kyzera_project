// src/data/collegeRoster.js
// ============================================================================
// OFFICIAL UNIVERSITY MASTER DIRECTORY & ENROLLMENT DATABASE
// Generated via scripts/importCollegeRoster.js on 2026-10-30T18:41:30.803Z
// Total Enrolled Students: 7
// ============================================================================

export const COLLEGE_INFO = {
  institutionName: 'Kyzera Institute of Technology & Engineering',
  institutionCode: 'KITE-2026',
  domain: 'kyzera.edu',
  allowedDomains: ['.edu', '.ac.in', '@kyzera.edu'],
  campusPasscode: 'CAMPUS-2026',
  academicYear: '2024-2026'
};

export const COLLEGE_DEPARTMENTS = [
  'School of Computer Science & Engineering',
  'Department of Information Technology',
  'Department of Electrical & Electronics',
  'Department of Mechanical Engineering',
  'Department of Civil Engineering',
  'School of Management & Business Studies'
];

export const COLLEGE_STUDENTS = [
  {
    "roll": "2024-CS-001",
    "name": "Aarav Sharma",
    "email": "aarav.sharma@kyzera.edu",
    "department": "School of Computer Science & Engineering",
    "batch": "2024-2028",
    "dorm": "Hostel Block A Room 101",
    "status": "ACTIVE"
  },
  {
    "roll": "2024-CS-041",
    "name": "Aditya Sharma",
    "email": "a.sharma@kyzera.edu",
    "department": "School of Computer Science & Engineering",
    "batch": "2024-2028",
    "dorm": "Hostel Block C Room 312",
    "status": "ACTIVE"
  },
  {
    "roll": "2024-CS-082",
    "name": "Himanshu Thakur",
    "email": "thakurhimanshu830@gmail.com",
    "department": "School of Computer Science & Engineering",
    "batch": "2024-2028",
    "dorm": "Hostel Block A Room 104",
    "status": "ACTIVE"
  },
  {
    "roll": "2024-IT-019",
    "name": "Zester Student",
    "email": "zester830@gmail.com",
    "department": "Department of Information Technology",
    "batch": "2024-2028",
    "dorm": "Hostel Block B Room 208",
    "status": "ACTIVE"
  },
  {
    "roll": "2024-EE-015",
    "name": "Priya Patel",
    "email": "priya.patel@kyzera.edu",
    "department": "Department of Electrical & Electronics",
    "batch": "2024-2028",
    "dorm": "Hostel Block D Room 402",
    "status": "ACTIVE"
  },
  {
    "roll": "2024-ME-033",
    "name": "Rohan Verma",
    "email": "rohan.verma@kyzera.edu",
    "department": "Department of Mechanical Engineering",
    "batch": "2024-2028",
    "dorm": "Hostel Block B Room 115",
    "status": "ACTIVE"
  },
  {
    "roll": "2024-CV-012",
    "name": "Ananya Gupta",
    "email": "ananya.gupta@kyzera.edu",
    "department": "Department of Civil Engineering",
    "batch": "2024-2028",
    "dorm": "Hostel Block D Room 210",
    "status": "ACTIVE"
  }
];

export const COLLEGE_FACULTY = [
  {
    name: 'Prof. David Tan',
    email: 'prof.tan@kyzera.edu',
    title: 'Senior Faculty & Facilities Committee Lead',
    department: 'Kyzera Physical Infrastructure & Engineering Faculty',
    clearanceLevel: 'LEVEL_3',
    pin: '2345'
  },
  {
    name: 'Prof. Sarah Jenkins',
    email: 'prof.jenkins@kyzera.edu',
    title: 'Student Affairs Oversight Liaison',
    department: 'Academic Affairs & Course Division',
    clearanceLevel: 'LEVEL_3',
    pin: '2345'
  }
];

export const findStudentByRoll = (roll) => {
  if (!roll) return null;
  const clean = roll.trim().toUpperCase();
  return COLLEGE_STUDENTS.find(s => s.roll.toUpperCase() === clean) || null;
};

export const findStudentByEmail = (email) => {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  return COLLEGE_STUDENTS.find(s => s.email.toLowerCase() === clean) || null;
};

export const verifyCollegeEnrollment = (email, roll) => {
  const byRoll = findStudentByRoll(roll);
  if (byRoll) return { verified: true, student: byRoll, method: 'ROLL_MATCH' };

  const byEmail = findStudentByEmail(email);
  if (byEmail) return { verified: true, student: byEmail, method: 'EMAIL_MATCH' };

  const cleanEmail = (email || '').trim().toLowerCase();
  const hasCollegeDomain = COLLEGE_INFO.allowedDomains.some(d => cleanEmail.endsWith(d));
  if (hasCollegeDomain) {
    return {
      verified: true,
      student: {
        roll: roll || 'ENROLLED-STUDENT',
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        department: 'General Academic Division'
      },
      method: 'DOMAIN_MATCH'
    };
  }

  return { verified: false, student: null, method: 'NOT_FOUND' };
};
