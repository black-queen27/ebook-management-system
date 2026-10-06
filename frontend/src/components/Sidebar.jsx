import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Library, 
  Bookmark, 
  User, 
  Settings, 
  HelpCircle,
  BookOpen
} from 'lucide-react';

export default function Sidebar({ onHelpClick }) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Library Catalog', path: '/catalog', icon: Library },
    { name: 'My Library', path: '/library', icon: Bookmark },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-icon">
          <BookOpen size={20} color="#FFFFFF" strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          <span className="brand-title">E-Book</span>
          <span className="brand-subtitle">Management System</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer Help Icon */}
      <div className="sidebar-footer">
        <button 
          onClick={onHelpClick}
          className="help-icon-btn" 
          title="Help & Shortcuts"
        >
          <HelpCircle size={20} color="#64748B" />
        </button>
      </div>
    </aside>
  );
}
