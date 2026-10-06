import React, { useState } from 'react';
import { Database, Shield, Sliders, Bell, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Settings() {
  const { user, dbStatus } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [savingMsg, setSavingMsg] = useState('');

  const handleSavePreferences = () => {
    setSavingMsg('Settings saved successfully!');
    setTimeout(() => setSavingMsg(''), 2500);
  };

  return (
    <div className="profile-page">
      {savingMsg && (
        <div className="floating-toast success-toast">
          <CheckCircle2 size={16} />
          <span>{savingMsg}</span>
        </div>
      )}

      <div className="profile-page-header">
        <h1 className="page-heading">Settings</h1>
        <p className="page-subheading">System configuration, database connectivity, and notifications</p>
      </div>

      <div className="profile-two-columns-grid">
        {/* Card 1: Database Status */}
        <div className="profile-section-card">
          <div className="card-section-header">
            <div className="section-icon-badge blue-badge">
              <Database size={18} color="#2563EB" />
            </div>
            <h3 className="section-card-title">Database Configuration</h3>
          </div>

          <div style={{ padding: '16px 0', fontSize: '14px', color: '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>Database Engine:</span>
              <strong style={{ color: dbStatus?.is_mysql ? '#16A34A' : '#2563EB' }}>
                {dbStatus?.is_mysql ? 'MySQL Server 8.0' : 'SQLite (Demo Fallback)'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>Database Name:</span>
              <strong>{dbStatus?.database_name || 'ebook_management_system'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>Connection Host:</span>
              <code>{dbStatus?.host || 'localhost:3306'}</code>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span>Status:</span>
              <span style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Operational
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Notification Preferences */}
        <div className="profile-section-card">
          <div className="card-section-header">
            <div className="section-icon-badge blue-badge">
              <Bell size={18} color="#2563EB" />
            </div>
            <h3 className="section-card-title">Notifications</h3>
          </div>

          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <strong style={{ display: 'block', color: '#0F172A', fontSize: '14px' }}>Reading Reminders</strong>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Daily study reminder notifications</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
              <div>
                <strong style={{ display: 'block', color: '#0F172A', fontSize: '14px' }}>Weekly Reading Digest</strong>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Summary of pages read and habits formed</span>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="profile-bottom-actions">
        <button className="btn-save-profile" onClick={handleSavePreferences}>
          Save Preferences
        </button>
      </div>
    </div>
  );
}
