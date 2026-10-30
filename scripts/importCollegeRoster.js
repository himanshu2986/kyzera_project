// scripts/importCollegeRoster.js
// Utility script to import college student and faculty rosters from CSV files.
// Usage: node scripts/importCollegeRoster.js [path-to-csv]
// Default: node scripts/importCollegeRoster.js college_students_sample.csv

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = process.argv[2] || path.join(__dirname, '..', 'college_students_sample.csv');
const rosterJsPath = path.join(__dirname, '..', 'src', 'data', 'collegeRoster.js');

if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ CSV File not found: ${csvFilePath}`);
  console.log(`Please provide a valid CSV path, e.g.: node scripts/importCollegeRoster.js my_students.csv`);
  process.exit(1);
}

const rawCsv = fs.readFileSync(csvFilePath, 'utf8');
const lines = rawCsv.split(/\r?\n/).filter(line => line.trim().length > 0);

if (lines.length < 2) {
  console.error('❌ CSV file must contain a header row and at least one student record.');
  process.exit(1);
}

const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
const students = [];

for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',').map(v => v.trim());
  if (values.length < headers.length) continue;

  const record = {};
  headers.forEach((h, idx) => {
    record[h] = values[idx] || '';
  });

  students.push({
    roll: record.roll || record['roll no'] || record['roll_no'] || `STUDENT-${i}`,
    name: record.name || record['full name'] || 'College Student',
    email: record.email || record['email address'] || '',
    department: record.department || record.dept || record.branch || 'School of Computer Science & Engineering',
    batch: record.batch || record.year || '2024-2028',
    dorm: record.dorm || record.hostel || 'Hostel Campus',
    status: 'ACTIVE'
  });
}

console.log(`✅ Successfully parsed ${students.length} student records from CSV.`);

// Generate the updated collegeRoster.js
const updatedContent = `// src/data/collegeRoster.js
// ============================================================================
// OFFICIAL UNIVERSITY MASTER DIRECTORY & ENROLLMENT DATABASE
// Generated via scripts/importCollegeRoster.js on ${new Date().toISOString()}
// Total Enrolled Students: ${students.length}
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

export const COLLEGE_STUDENTS = ${JSON.stringify(students, null, 2)};

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
`;

fs.writeFileSync(rosterJsPath, updatedContent, 'utf8');
console.log(`🎉 Updated ${rosterJsPath} with ${students.length} student records!`);

