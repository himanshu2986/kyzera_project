// Utility functions for Kyzera cryptographic functions and formatting

export async function sha256(message) {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // fallback below
    }
  }
  // Simple deterministic fallback hash
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0') + 'a7f9208e3b1c';
}

export function generateAnonymousId() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `#CP-${num}`;
}

export function isTicketOwner(ticket, user) {
  if (!ticket || !user) return false;

  // 1. Primary and definitive check: Email address
  if (user.email && ticket.studentEmail) {
    return user.email.trim().toLowerCase() === ticket.studentEmail.trim().toLowerCase();
  }

  // 2. Fallback: Check anonymous studentId token if studentEmail is absent
  if (!ticket.studentEmail && user.anonymousId && ticket.studentId) {
    const cleanUserAnon = user.anonymousId.replace(/[^0-9]/g, '');
    const cleanTicketAnon = String(ticket.studentId).replace(/[^0-9]/g, '');
    if (cleanUserAnon && cleanTicketAnon && cleanUserAnon === cleanTicketAnon) {
      return true;
    }
  }

  // 3. Fallback: Exact name match ONLY if ticket has NO email and NO token
  if (!ticket.studentEmail && !ticket.studentId && user.name && ticket.studentRealName) {
    return user.name.trim().toLowerCase() === ticket.studentRealName.trim().toLowerCase();
  }

  return false;
}

export function formatTimeAgo(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  const diffDays = Math.floor(diffSec / 86400);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function exportToCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

