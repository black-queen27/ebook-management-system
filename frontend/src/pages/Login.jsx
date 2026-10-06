import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen, GraduationCap, Bookmark, Eye, EyeOff, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [email, setEmail] = useState('sharini@student.edu');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [college, setCollege] = useState('Loyola ICAM College');
  const [course, setCourse] = useState('B.Tech Information Technology');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name.');
          setLoading(false);
          return;
        }
        const res = await api.register({
          name: name.trim(),
          email: email.trim(),
          password,
          phone,
          college,
          course,
          role: 'Student',
        });
        loginUser(res.user);
        setSuccessMessage('Registration successful! Redirecting to Dashboard...');
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        const res = await api.login(email.trim(), password);
        loginUser(res.user);
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 600);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setIsRegisterMode(false);
    setEmail('sharini@student.edu');
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div className="login-page-container">
      {/* LEFT COLUMN: Blue Promotional Hero Panel with Tablet Illustration */}
      <div className="login-hero-panel">
        {/* Brand Header */}
        <div className="hero-brand">
          <div className="hero-logo-box">
            <BookOpen size={20} color="#2563EB" strokeWidth={2.5} />
          </div>
          <div className="hero-brand-text">
            <span className="hero-brand-title">E-Book</span>
            <span className="hero-brand-subtitle">Management System</span>
          </div>
        </div>

        {/* Decorative Graphic Center */}
        <div className="hero-illustration-wrapper">
          {/* Subtle background circular halo rings */}
          <div className="halo-ring ring-1" />
          <div className="halo-ring ring-2" />

          {/* Floating Gold/Yellow Bookmark Badge */}
          <div className="floating-badge badge-yellow">
            <Bookmark size={24} color="#FFFFFF" fill="#FFFFFF" />
          </div>

          {/* Center Tablet Device Mockup */}
          <div className="tablet-mockup">
            {/* Tablet Header Bar */}
            <div className="tablet-header">
              <div className="tablet-lib-title">
                <BookOpen size={14} color="#2563EB" />
                <span>My Library</span>
              </div>
              <Bookmark size={14} color="#2563EB" />
            </div>

            {/* Book Card inside Tablet */}
            <div className="tablet-book-card">
              <div className="tablet-cover-orange">
                <div className="cover-bar" />
                <span className="cover-tag">ATOMIC</span>
                <span className="cover-tag sub">HABITS</span>
                <div className="cover-sparkle">✦</div>
              </div>

              <div className="tablet-book-info">
                <h5>Atomic Habits</h5>
                <p>James Clear</p>
                <div className="mini-progress-bar">
                  <div className="mini-progress-fill" style={{ width: '68%' }} />
                </div>
              </div>
            </div>

            {/* Skeleton lines on tablet */}
            <div className="tablet-skeleton-line line-long" />
            <div className="tablet-skeleton-line line-short" />

            {/* Continue Reading Action Button */}
            <button className="tablet-action-btn" type="button">
              Continue Reading
            </button>
          </div>

          {/* Floating Emerald Green Card */}
          <div className="floating-card-green">
            <div className="green-card-text">
              <span>READ.</span>
              <span>LEARN.</span>
              <span>GROW.</span>
            </div>
            <div className="green-card-icon">
              <GraduationCap size={24} color="#FFFFFF" strokeWidth={2.2} />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Clean White Auth Form */}
      <div className="login-form-panel">
        <div className="form-content-box">
          {/* Form Brand Header */}
          <div className="form-brand-header">
            <div className="form-logo-box">
              <BookOpen size={20} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <div className="form-brand-text">
              <span className="form-brand-title">E-Book</span>
              <span className="form-brand-subtitle">Management System</span>
            </div>
          </div>

          {/* Welcome Title */}
          <h2 className="auth-title">
            {isRegisterMode ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="auth-subtitle">
            {isRegisterMode
              ? 'Join our campus e-book community to access textbooks and notes.'
              : 'Enter your credentials to access your student library.'}
          </p>

          {/* Error / Success Alerts */}
          {errorMessage && <div className="alert-box alert-error">{errorMessage}</div>}
          {successMessage && <div className="alert-box alert-success">{successMessage}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {isRegisterMode && (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="e.g. Sharini"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>College / Institution</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Loyola ICAM College"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="sharini@student.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isRegisterMode && (
              <div className="form-extra-row">
                <label className="checkbox-label" onClick={() => setRememberMe(!rememberMe)}>
                  {rememberMe ? (
                    <CheckSquare size={18} color="#2563EB" />
                  ) : (
                    <Square size={18} color="#94A3B8" />
                  )}
                  <span>Remember Me</span>
                </label>

                <a href="#forgot" className="forgot-password-link" onClick={(e) => { e.preventDefault(); alert("Password reset link has been dispatched to your registered student email."); }}>
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Big Primary Login Button */}
            <button type="submit" className="btn-primary-auth" disabled={loading}>
              {loading ? (
                'Processing...'
              ) : isRegisterMode ? (
                'Create Account'
              ) : (
                'Login'
              )}
            </button>

            {/* One-click Demo Button */}
            <button
              type="button"
              className="btn-demo-fill"
              onClick={fillDemoAccount}
              title="Click to quickly fill Sharini's default credentials"
            >
              Demo: Login as Sharini
            </button>

            {/* Toggle Mode */}
            <div className="auth-footer-toggle">
              <span>
                {isRegisterMode
                  ? 'Already have an account? '
                  : "Don't have an account? "}
              </span>
              <button
                type="button"
                className="toggle-link-btn"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
              >
                {isRegisterMode ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
