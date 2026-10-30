import React from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmergencyBanner from './components/EmergencyBanner';
import Toast from './components/Toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import SubmitComplaint from './pages/SubmitComplaint';
import StudentDashboard from './pages/StudentDashboard';
import ComplaintDetail from './pages/ComplaintDetail';
import AdminCommandCenter from './pages/AdminCommandCenter';
import DuplicateCluster from './pages/DuplicateCluster';
import PrivacyAudit from './pages/PrivacyAudit';

function AppContent() {
  const { currentPage, isAuthenticated, currentUser } = useCampus();
  const isTeacherOrAdmin =
    currentUser?.role?.includes('Admin') ||
    currentUser?.role?.includes('Teacher') ||
    currentUser?.role?.toLowerCase().includes('faculty');

  const renderPage = () => {
    // When not logged in, first and default page is strictly Login (or About Kyzera if clicked)
    if (!isAuthenticated && currentPage !== 'home') {
      return <Login />;
    }

    switch (currentPage) {
      case 'home':
        return <Landing />;
      case 'login':
        return <Login />;
      case 'submit':
        return <SubmitComplaint />;
      case 'dashboard':
        return <StudentDashboard />;
      case 'ticket-detail':
        return <ComplaintDetail />;
      case 'admin':
        if (!isTeacherOrAdmin) {
          return <StudentDashboard />;
        }
        return <AdminCommandCenter />;
      case 'duplicate-cluster':
        return <DuplicateCluster />;
      case 'privacy-audit':
        if (!isTeacherOrAdmin) {
          return <StudentDashboard />;
        }
        return <PrivacyAudit />;
      default:
        return <Login />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-[#f8fafc]">
      <EmergencyBanner />
      <Navbar />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <CampusProvider>
      <AppContent />
    </CampusProvider>
  );
}

