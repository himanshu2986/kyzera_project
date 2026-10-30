// scripts/importCollegeRoster.js
// Utility script to import college student and faculty rosters from CSV files.
// Usage:
//   node scripts/importCollegeRoster.js                              (imports default students & teachers CSVs)
//   node scripts/importCollegeRoster.js [students.csv] [teachers.csv]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const studentsCsvPath = process.argv[2] || path.join(__dirname, '..', 'college_students_sample.csv');
const teachersCsvPath = process.argv[3] || path.join(__dirname, '..', 'college_teachers_sample.csv');
const rosterJsPath = path.join(__dirname, '..', 'src', 'data', 'collegeRoster.js');

// 1. Parse Students CSV
const students = [];
if (fs.existsSync(studentsCsvPath)) {
  const rawStudentCsv = fs.readFileSync(studentsCsvPath, 'utf8');
  const studentLines = rawStudentCsv.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (studentLines.length >= 2) {
    const headers = studentLines[0].split(',').map(h => h.trim().toLowerCase());
    for (let i = 1; i < studentLines.length; i++) {
      const values = studentLines[i].split(',').map(v => v.trim());
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
    console.log(`✅ Parsed ${students.length} student records from ${path.basename(studentsCsvPath)}.`);
  }
}

// 2. Parse Teachers CSV
const faculty = [];
if (fs.existsSync(teachersCsvPath)) {
  const rawTeacherCsv = fs.readFileSync(teachersCsvPath, 'utf8');
  const teacherLines = rawTeacherCsv.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (teacherLines.length >= 2) {
    const headers = teacherLines[0].split(',').map(h => h.trim().toLowerCase());
    for (let i = 1; i < teacherLines.length; i++) {
      const values = teacherLines[i].split(',').map(v => v.trim());
      if (values.length < headers.length) continue;
      const record = {};
      headers.forEach((h, idx) => {
        record[h] = values[idx] || '';
      });

      faculty.push({
        id: record.faculty_id || record.id || `FAC-${100 + i}`,
        name: record.name || record['full name'] || 'Faculty Member',
        email: record.email || record['email address'] || '',
        department: record.department || record.dept || 'Academic Faculty',
        title: record.title || record.designation || 'Faculty Member',
        clearanceLevel: record.clearance_level || record.clearance || 'LEVEL_3',
        pin: record.pin || '2345'
      });
    }
    console.log(`✅ Parsed ${faculty.length} faculty/teacher records from ${path.basename(teachersCsvPath)}.`);
  }
}

// Fallback faculty if no CSV provided
const finalFaculty = faculty.length > 0 ? faculty : [
  {
    id: 'FAC-101',
    name: 'Prof. David Tan',
    email: 'prof.tan@kyzera.edu',
    title: 'Senior Faculty & Facilities Committee Lead',
    department: 'Physical Infrastructure & Engineering',
    clearanceLevel: 'LEVEL_3',
    pin: '2345'
  },
  {
    id: 'FAC-102',
    name: 'Prof. Sarah Jenkins',
    email: 'prof.jenkins@kyzera.edu',
    title: 'Student Affairs Oversight Liaison',
    department: 'Academic Affairs & Course Division',
    clearanceLevel: 'LEVEL_3',
    pin: '2345'
  }
];

// Generate updated collegeRoster.js
const updatedContent = `// src/data/collegeRoster.js
// ============================================================================
// OFFICIAL UNIVERSITY MASTER DIRECTORY & ENROLLMENT DATABASE
// Generated via scripts/importCollegeRoster.js on ${new Date().toISOString()}
// Students: ${students.length} | Faculty / Staff: ${finalFaculty.length}
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
  'School of Management & Business Studies',
  'Physical Infrastructure & Engineering',
  'Academic Affairs & Course Division',
  'Sanitation & Mechanical Facilities'
];

export const COLLEGE_STUDENTS = ${JSON.stringify(students, null, 2)};

export const COLLEGE_FACULTY = ${JSON.stringify(finalFaculty, null, 2)};

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

export const findFacultyByEmail = (email) => {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  return COLLEGE_FACULTY.find(f => f.email.toLowerCase() === clean) || null;
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
console.log(`🎉 Master directory synced! ${students.length} students & ${finalFaculty.length} faculty members.`);
