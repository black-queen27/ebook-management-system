import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Library, 
  Bookmark, 
  BookOpen, 
  CheckCircle2, 
  Star,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookCover from '../components/BookCover';
import ReaderModal from '../components/ReaderModal';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeReadingBook, setActiveReadingBook] = useState(null);

  // Formatted date matching Figma pill "September 26, 2026"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const loadData = async () => {
    try {
      const res = await api.getDashboardData(user?.id || 1);
      setDashboardData(res);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle book progress update from ReaderModal
  const handleProgressUpdated = (newProgress, newStatus) => {
    loadData();
  };

  const stats = dashboardData?.stats || {
    total_books: 128,
    total_books_trend: '+12 this month',
    my_books: 24,
    my_books_trend: '+3 this month',
    currently_reading: 5,
    currently_reading_trend: '2 updated today',
    completed: 18,
    completed_trend: '+4 this semester'
  };

  const continueReading = dashboardData?.continue_reading || [];
  const recentlyAdded = dashboardData?.recently_added || [];

  return (
    <div className="dashboard-page">
      {/* Top Welcome Header Row */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="page-heading">Good Morning, {user?.name || 'Sharini'}!</h1>
          <p className="page-subheading">Discover, manage and enjoy your e-books</p>
        </div>

        <div className="date-badge-pill">
          <Calendar size={16} color="#64748B" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="metrics-grid">
        {/* Total Books */}
        <div className="metric-card">
          <div className="metric-icon-box blue-bg">
            <Library size={22} color="#2563EB" />
          </div>
          <div className="metric-content">
            <span className="metric-value">{stats.total_books}</span>
            <span className="metric-label">Total Books</span>
            <span className="metric-trend blue-text">{stats.total_books_trend}</span>
          </div>
        </div>

        {/* My Books */}
        <div className="metric-card">
          <div className="metric-icon-box purple-bg">
            <Bookmark size={22} color="#9333EA" />
          </div>
          <div className="metric-content">
            <span className="metric-value">{stats.my_books}</span>
            <span className="metric-label">My Books</span>
            <span className="metric-trend purple-text">{stats.my_books_trend}</span>
          </div>
        </div>

        {/* Currently Reading */}
        <div className="metric-card">
          <div className="metric-icon-box amber-bg">
            <BookOpen size={22} color="#D97706" />
          </div>
          <div className="metric-content">
            <span className="metric-value">{stats.currently_reading}</span>
            <span className="metric-label">Currently Reading</span>
            <span className="metric-trend amber-text">{stats.currently_reading_trend}</span>
          </div>
        </div>

        {/* Completed */}
        <div className="metric-card">
          <div className="metric-icon-box green-bg">
            <CheckCircle2 size={22} color="#16A34A" />
          </div>
          <div className="metric-content">
            <span className="metric-value">{stats.completed}</span>
            <span className="metric-label">Completed</span>
            <span className="metric-trend green-text">{stats.completed_trend}</span>
          </div>
        </div>
      </div>

      {/* SECTION: Continue Reading */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Continue Reading</h2>
          <Link to="/library?status=Currently Reading" className="section-link">
            View all
          </Link>
        </div>

        <div className="continue-reading-grid">
          {continueReading.map((book) => (
            <div key={book.id} className="continue-reading-card">
              {/* Left: Mini Book Cover */}
              <div 
                className="continue-cover-wrapper"
                onClick={() => navigate(`/book/${book.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <BookCover
                  title={book.title}
                  author={book.author}
                  color={book.cover_color || '#ea580c'}
                  size="sm"
                />
              </div>

              {/* Right: Info and Progress */}
              <div className="continue-content">
                <h4 
                  className="continue-book-title"
                  onClick={() => navigate(`/book/${book.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {book.title}
                </h4>
                <p className="continue-book-author">by {book.author}</p>

                <div className="continue-progress-row">
                  <span className="progress-label">Reading progress</span>
                  <span className="progress-percent">{book.progress_percent || 0}%</span>
                </div>

                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${book.progress_percent || 0}%` }} 
                  />
                </div>

                <button 
                  className="btn-continue-reading"
                  onClick={() => setActiveReadingBook(book)}
                >
                  <BookOpen size={16} />
                  <span>Continue Reading</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: Recently Added */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recently Added</h2>
          <Link to="/catalog" className="section-link">
            View all
          </Link>
        </div>

        <div className="recently-added-grid">
          {recentlyAdded.map((book) => (
            <div 
              key={book.id} 
              className="recently-added-card"
              onClick={() => navigate(`/book/${book.id}`)}
            >
              {/* Mini Book Cover on Left */}
              <div className="recent-cover-box">
                <BookCover
                  title={book.title}
                  author={book.author}
                  color={book.cover_color || '#15803d'}
                  size="sm"
                />
              </div>

              {/* Book Info on Right */}
              <div className="recent-info-box">
                <h4 className="recent-title">{book.title}</h4>
                <p className="recent-author">by {book.author}</p>

                <div className="recent-meta-row">
                  <span 
                    className="recent-category-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/catalog?category=${encodeURIComponent(book.category)}`);
                    }}
                  >
                    {book.category}
                  </span>

                  <div className="rating-pill">
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <span>{book.rating || 4.7}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reader Modal */}
      {activeReadingBook && (
        <ReaderModal
          book={activeReadingBook}
          initialProgress={activeReadingBook.progress_percent || 0}
          onClose={() => setActiveReadingBook(null)}
          onProgressUpdated={handleProgressUpdated}
        />
      )}
    </div>
  );
}
