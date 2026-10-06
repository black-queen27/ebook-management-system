import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, Bookmark, LogOut, CheckCircle2, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onSearch }) {
  const { user, logoutUser, dbStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Sync search input with URL params if on /catalog
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearchTerm(q);
  }, [location.search]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/catalog?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="app-header">
      {/* Global Search Bar */}
      <form className="header-search-bar" onSubmit={handleSearchSubmit}>
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search books, authors or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      {/* Header Right Actions */}
      <div className="header-actions" ref={dropdownRef}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="notification-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            title="Notifications"
          >
            <Bell size={18} />
            <span className="notification-dot" />
          </button>

          {showNotifications && (
            <div className="dropdown-panel notifications-panel">
              <div className="panel-header">
                <h6>Notifications</h6>
                <span className="badge-new">3 new</span>
              </div>
              <div className="panel-body">
                <div className="notification-item unread">
                  <span className="notif-bullet" />
                  <div>
                    <p className="notif-title">Keep it up, {user?.name || 'Sharini'}!</p>
                    <p className="notif-desc">You are 68% through Atomic Habits.</p>
                  </div>
                </div>
                <div className="notification-item">
                  <span className="notif-bullet gray" />
                  <div>
                    <p className="notif-title">New Arrivals</p>
                    <p className="notif-desc">Python Crash Course is now available in the catalog.</p>
                  </div>
                </div>
                <div className="notification-item">
                  <span className="notif-bullet gray" />
                  <div>
                    <p className="notif-title">Semester Goal</p>
                    <p className="notif-desc">18 books completed this semester!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="user-profile-trigger"
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
          >
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={user?.name || 'User'}
              className="user-avatar"
            />
            <div className="user-info-text">
              <span className="user-name">{user?.name || 'Sharini'}</span>
              <span className="user-role">{user?.role || 'Student'}</span>
            </div>
            <ChevronDown size={16} className="chevron-icon" />
          </button>

          {showUserDropdown && (
            <div className="dropdown-panel user-dropdown-menu">
              <div className="user-dropdown-header">
                <strong>{user?.name || 'Sharini'}</strong>
                <small>{user?.email || 'sharini@student.edu'}</small>
                {dbStatus && (
                  <div className="db-status-pill">
                    <Database size={12} />
                    <span>{dbStatus.is_mysql ? 'MySQL Database' : 'SQLite Database'}</span>
                  </div>
                )}
              </div>

              <div className="dropdown-divider" />

              <button
                className="dropdown-menu-item"
                onClick={() => {
                  setShowUserDropdown(false);
                  navigate('/profile');
                }}
              >
                <User size={16} />
                <span>My Profile</span>
              </button>

              <button
                className="dropdown-menu-item"
                onClick={() => {
                  setShowUserDropdown(false);
                  navigate('/library');
                }}
              >
                <Bookmark size={16} />
                <span>My Library</span>
              </button>

              <div className="dropdown-divider" />

              <button className="dropdown-menu-item logout-item" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
