import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Building2, 
  Heart, 
  Edit3, 
  Save, 
  X, 
  Camera,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorToast, setErrorToast] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: 'Sharini',
    email: 'sharini@student.edu',
    phone: '+91 98765 43210',
    date_of_birth: '14 August 2006',
    college: 'Loyola ICAM College',
    course: 'B.Tech Information Technology',
    year_of_study: '2nd Year',
    department: 'Information Technology',
    reading_preferences: ['Fiction', 'Technology', 'Self Development', 'Science', 'Business'],
  });

  const allAvailablePreferences = [
    'Fiction',
    'Technology',
    'Self Development',
    'Science',
    'Business',
    'History',
    'Programming',
    'Biography'
  ];

  // Fetch latest user data from DB
  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      const res = await api.getUserProfile(user.id);
      if (res.user) {
        const u = res.user;
        const prefs = u.reading_preferences
          ? u.reading_preferences.split(',').map((p) => p.trim())
          : ['Fiction', 'Technology', 'Self Development', 'Science', 'Business'];

        setFormData({
          name: u.name || 'Sharini',
          email: u.email || 'sharini@student.edu',
          phone: u.phone || '+91 98765 43210',
          date_of_birth: u.date_of_birth || '14 August 2006',
          college: u.college || 'Loyola ICAM College',
          course: u.course || 'B.Tech Information Technology',
          year_of_study: u.year_of_study || '2nd Year',
          department: u.department || 'Information Technology',
          reading_preferences: prefs,
        });
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTogglePreference = (topic) => {
    if (!isEditing) return;
    setFormData((prev) => {
      const current = prev.reading_preferences;
      if (current.includes(topic)) {
        return { ...prev, reading_preferences: current.filter((t) => t !== topic) };
      } else {
        return { ...prev, reading_preferences: [...current, topic] };
      }
    });
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorToast('');

    try {
      const payload = {
        ...formData,
        reading_preferences: formData.reading_preferences.join(','),
      };

      const res = await api.updateUserProfile(user?.id || 1, payload);
      updateUser(res.user);
      setIsEditing(false);
      setSuccessToast('Profile changes saved successfully to database!');
      setTimeout(() => setSuccessToast(''), 3500);
    } catch (err) {
      setErrorToast(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
    setErrorToast('');
  };

  return (
    <div className="profile-page">
      {/* Toast Feedback */}
      {successToast && (
        <div className="floating-toast success-toast">
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}
      {errorToast && <div className="floating-toast error-toast">{errorToast}</div>}

      {/* Page Title */}
      <div className="profile-page-header">
        <h1 className="page-heading">My Profile</h1>
        <p className="page-subheading">Manage your personal details and reading preferences</p>
      </div>

      {/* HERO CARD: Avatar, Name, Email, Student Badge, Edit Profile Button */}
      <div className="profile-hero-card">
        <div className="hero-avatar-wrapper">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
            alt="Profile Avatar"
            className="hero-avatar-img"
          />
          <button 
            className="avatar-camera-badge"
            title="Change Profile Picture"
            onClick={() => alert("Avatar upload: Choose image or use default student photo.")}
          >
            <Camera size={14} color="#FFFFFF" />
          </button>
        </div>

        <div className="hero-info-column">
          <h2 className="hero-user-name">{formData.name}</h2>
          <div className="hero-email-row">
            <Mail size={16} color="#64748B" />
            <span>{formData.email}</span>
          </div>
          <span className="hero-role-pill">{user?.role || 'Student'}</span>
        </div>

        <div className="hero-action-right">
          <button
            className={`btn-edit-profile ${isEditing ? 'active' : ''}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 size={16} />
            <span>{isEditing ? 'Editing Mode' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMNS: Personal Information & Academic Information */}
      <div className="profile-two-columns-grid">
        {/* CARD 1: Personal Information */}
        <div className="profile-section-card">
          <div className="card-section-header">
            <div className="section-icon-badge blue-badge">
              <User size={18} color="#2563EB" />
            </div>
            <h3 className="section-card-title">Personal Information</h3>
          </div>

          <div className="fields-2x2-grid">
            {/* Full Name */}
            <div className="field-group">
              <label>Full Name</label>
              <div className="field-input-box">
                <User size={18} className="field-icon" />
                <input
                  type="text"
                  value={formData.name}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="field-group">
              <label>Email Address</label>
              <div className="field-input-box">
                <Mail size={18} className="field-icon" />
                <input
                  type="email"
                  value={formData.email}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="field-group">
              <label>Phone Number</label>
              <div className="field-input-box">
                <Phone size={18} className="field-icon" />
                <input
                  type="text"
                  value={formData.phone}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="field-group">
              <label>Date of Birth</label>
              <div className="field-input-box">
                <Calendar size={18} className="field-icon" />
                <input
                  type="text"
                  value={formData.date_of_birth}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Academic Information */}
        <div className="profile-section-card">
          <div className="card-section-header">
            <div className="section-icon-badge blue-badge">
              <GraduationCap size={18} color="#2563EB" />
            </div>
            <h3 className="section-card-title">Academic Information</h3>
          </div>

          <div className="fields-2x2-grid">
            {/* College */}
            <div className="field-group">
              <label>College</label>
              <div className="field-input-box">
                <Building2 size={18} className="field-icon" />
                <input
                  type="text"
                  value={formData.college}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('college', e.target.value)}
                />
              </div>
            </div>

            {/* Course */}
            <div className="field-group">
              <label>Course</label>
              <div className="field-input-box">
                <BookOpen size={18} className="field-icon" />
                <input
                  type="text"
                  value={formData.course}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('course', e.target.value)}
                />
              </div>
            </div>

            {/* Year */}
            <div className="field-group">
              <label>Year</label>
              <div className="field-input-box">
                <Calendar size={18} className="field-icon" />
                <input
                  type="text"
                  value={formData.year_of_study}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('year_of_study', e.target.value)}
                />
              </div>
            </div>

            {/* Department */}
            <div className="field-group">
              <label>Department</label>
              <div className="field-input-box">
                <Building2 size={18} className="field-icon" />
                <input
                  type="text"
                  value={formData.department}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: Reading Preferences */}
      <div className="profile-section-card preferences-card">
        <div className="preferences-header-row">
          <div className="pref-title-left">
            <div className="section-icon-badge blue-badge">
              <Heart size={18} color="#2563EB" />
            </div>
            <div>
              <h3 className="section-card-title">Reading Preferences</h3>
              <p className="pref-subtitle">Choose topics you enjoy to improve recommendations</p>
            </div>
          </div>

          <span className="pref-count-badge">
            {formData.reading_preferences.length} selected
          </span>
        </div>

        <div className="preferences-pills-container">
          {allAvailablePreferences.map((topic) => {
            const isSelected = formData.reading_preferences.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                className={`pref-pill-btn ${isSelected ? 'selected' : ''} ${!isEditing ? 'readonly' : ''}`}
                onClick={() => handleTogglePreference(topic)}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Buttons: Cancel and Save Changes */}
      <div className="profile-bottom-actions">
        <button 
          className="btn-cancel-profile" 
          onClick={handleCancel}
          disabled={!isEditing && !saving}
        >
          Cancel
        </button>

        <button 
          className="btn-save-profile" 
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
}
