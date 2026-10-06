import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LibraryCatalog from './pages/LibraryCatalog';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import MyLibrary from './pages/MyLibrary';
import Settings from './pages/Settings';

import './styles.css';

// Protected layout component that wraps authenticated screens
function AppLayout({ children }) {
  const { user } = useAuth();
  const [showHelpModal, setShowHelpModal] = useState(false);

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar onHelpClick={() => setShowHelpModal(true)} />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Sticky Top Header with Search and Profile */}
        <Header />

        {/* Page Content */}
        <main className="page-content-wrapper">
          {children}
        </main>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="modal-backdrop" onClick={() => setShowHelpModal(false)}>
          <div className="reader-modal-card" style={{ maxWidth: '500px', padding: '28px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              E-Book Management System
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '20px' }}>
              Software Engineering Mini Project Demonstration Guide
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155' }}>
              <div><strong>Navigation:</strong> Use the sidebar to switch between Dashboard, Catalog, Library and Profile.</div>
              <div><strong>Reading & Progress:</strong> Click "Continue Reading" or "Read Now" on any book to test reading progress updates saved directly to MySQL.</div>
              <div><strong>Search & Filter:</strong> Use the top search bar or category pills to dynamically filter books.</div>
              <div><strong>Profile Editing:</strong> Click "Edit Profile" on the Profile page to update your details in the database.</div>
            </div>

            <button
              className="btn-primary-auth"
              style={{ marginTop: '24px', height: '42px' }}
              onClick={() => setShowHelpModal(false)}
            >
              Got it, close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Authenticated Routes */}
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/catalog"
            element={
              <AppLayout>
                <LibraryCatalog />
              </AppLayout>
            }
          />
          <Route
            path="/book/:id"
            element={
              <AppLayout>
                <BookDetails />
              </AppLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <AppLayout>
                <Profile />
              </AppLayout>
            }
          />
          <Route
            path="/library"
            element={
              <AppLayout>
                <MyLibrary />
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout>
                <Settings />
              </AppLayout>
            }
          />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
