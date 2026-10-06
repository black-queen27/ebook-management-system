import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bookmark, 
  BookOpen, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookCover from '../components/BookCover';
import ReaderModal from '../components/ReaderModal';

export default function MyLibrary() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [libraryBooks, setLibraryBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [activeReaderBook, setActiveReaderBook] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Read status from URL if provided (e.g. from Dashboard Continue Reading "View all")
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status) setActiveTab(status);
  }, [location.search]);

  const loadLibrary = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.getUserLibrary(user.id);
      setLibraryBooks(res.books || []);
    } catch (err) {
      console.error('Failed to load library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, [user]);

  const handleStatusChange = async (book, newStatus) => {
    try {
      const newProgress = newStatus === 'Completed' ? 100 : book.progress_percent;
      await api.updateReadingStatus(user.id, book.book_id, newStatus, newProgress);
      showToast(`Updated "${book.title}" to ${newStatus}`);
      loadLibrary();
    } catch (e) {
      showToast('Failed to update status');
    }
  };

  const handleProgressChange = async (book, newProgress) => {
    try {
      const newStatus = newProgress >= 100 ? 'Completed' : 'Currently Reading';
      await api.updateReadingStatus(user.id, book.book_id, newStatus, newProgress);
      loadLibrary();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = async (book) => {
    if (!window.confirm(`Are you sure you want to remove "${book.title}" from your library?`)) {
      return;
    }
    try {
      await api.removeFromLibrary(user.id, book.book_id);
      showToast(`Removed "${book.title}" from your library.`);
      loadLibrary();
    } catch (e) {
      showToast('Failed to remove book');
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Filter books by active tab
  const filteredBooks = libraryBooks.filter((b) => {
    if (activeTab === 'All') return true;
    return b.reading_status?.toLowerCase() === activeTab.toLowerCase();
  });

  // Calculate counts
  const currentlyReadingCount = libraryBooks.filter((b) => b.reading_status === 'Currently Reading').length;
  const completedCount = libraryBooks.filter((b) => b.reading_status === 'Completed').length;
  const wantToReadCount = libraryBooks.filter((b) => b.reading_status === 'Want to Read').length;

  return (
    <div className="my-library-page">
      {/* Toast Alert */}
      {toastMsg && <div className="floating-toast">{toastMsg}</div>}

      {/* Header */}
      <div className="library-header-row">
        <div>
          <h1 className="page-heading">My Library</h1>
          <p className="page-subheading">Track your personal collection, reading progress and achievements</p>
        </div>

        <button 
          className="btn-browse-catalog"
          onClick={() => navigate('/catalog')}
        >
          <BookOpen size={16} />
          <span>Browse Catalog</span>
        </button>
      </div>

      {/* Filter Tabs Row */}
      <div className="library-tabs-row">
        {[
          { label: 'All Books', value: 'All', count: libraryBooks.length },
          { label: 'Currently Reading', value: 'Currently Reading', count: currentlyReadingCount },
          { label: 'Completed', value: 'Completed', count: completedCount },
          { label: 'Want to Read', value: 'Want to Read', count: wantToReadCount },
        ].map((tab) => (
          <button
            key={tab.value}
            className={`library-tab-btn ${activeTab === tab.value ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            <span>{tab.label}</span>
            <span className="tab-counter">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="catalog-loading">
          <div className="spinner-blue" />
          <p>Loading your personal library...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="catalog-empty">
          <Bookmark size={48} color="#94A3B8" />
          <h3>No books in this view</h3>
          <p>Explore the library catalog to discover and add books to your collection.</p>
          <button className="btn-primary-auth" onClick={() => navigate('/catalog')} style={{ maxWidth: '200px' }}>
            Explore Books
          </button>
        </div>
      ) : (
        <div className="my-library-grid">
          {filteredBooks.map((item) => (
            <div key={item.library_id} className="my-library-card">
              {/* Left Cover */}
              <div 
                className="my-lib-cover"
                onClick={() => navigate(`/book/${item.book_id}`)}
                style={{ cursor: 'pointer' }}
              >
                <BookCover
                  title={item.title}
                  author={item.author}
                  color={item.cover_color || '#2563eb'}
                  size="sm"
                />
              </div>

              {/* Right Content */}
              <div className="my-lib-info">
                <div className="my-lib-top-meta">
                  <span className="category-tag-pill">{item.category}</span>

                  {/* Status Dropdown Selector */}
                  <select
                    className="status-selector"
                    value={item.reading_status}
                    onChange={(e) => handleStatusChange(item, e.target.value)}
                  >
                    <option value="Currently Reading">Currently Reading</option>
                    <option value="Completed">Completed</option>
                    <option value="Want to Read">Want to Read</option>
                  </select>
                </div>

                <h4 
                  className="my-lib-title"
                  onClick={() => navigate(`/book/${item.book_id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.title}
                </h4>
                <p className="my-lib-author">by {item.author}</p>

                {/* Progress bar */}
                <div className="my-lib-progress-section">
                  <div className="progress-labels">
                    <span>Progress</span>
                    <strong>{item.progress_percent || 0}%</strong>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${item.progress_percent || 0}%` }} 
                    />
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="my-lib-actions-row">
                  <button
                    className="btn-read-sm"
                    onClick={() => setActiveReaderBook({
                      id: item.book_id,
                      title: item.title,
                      author: item.author,
                      description: item.description,
                      pages: item.pages,
                      progress_percent: item.progress_percent
                    })}
                  >
                    <BookOpen size={14} />
                    <span>Read</span>
                  </button>

                  <button
                    className="btn-remove-sm"
                    title="Remove from library"
                    onClick={() => handleRemove(item)}
                  >
                    <Trash2 size={14} color="#EF4444" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reader Modal */}
      {activeReaderBook && (
        <ReaderModal
          book={activeReaderBook}
          initialProgress={activeReaderBook.progress_percent || 0}
          onClose={() => setActiveReaderBook(null)}
          onProgressUpdated={(newProg, newStatus) => {
            loadLibrary();
          }}
        />
      )}
    </div>
  );
}
