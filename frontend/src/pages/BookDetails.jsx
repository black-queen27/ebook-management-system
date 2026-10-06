import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Star, 
  Calendar, 
  Layers, 
  Globe, 
  FileText, 
  CheckCircle, 
  HardDrive, 
  BookOpen, 
  Bookmark, 
  BookmarkCheck,
  Download,
  Clock,
  Users
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookCover from '../components/BookCover';
import ReaderModal from '../components/ReaderModal';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingStatus, setReadingStatus] = useState('Currently Reading');
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadBookDetails = async () => {
    setLoading(true);
    try {
      const res = await api.getBookById(id);
      setBook(res.book);
      setRelatedBooks(res.related_books || []);

      // Check if this book is in the user's library
      if (user?.id) {
        const libRes = await api.getUserLibrary(user.id);
        const match = (libRes.books || []).find((b) => b.book_id === Number(id));
        if (match) {
          setIsInLibrary(true);
          setReadingProgress(match.progress_percent || 0);
          setReadingStatus(match.reading_status || 'Currently Reading');
        } else {
          setIsInLibrary(false);
        }
      }
    } catch (err) {
      console.error('Failed to load book details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookDetails();
    window.scrollTo(0, 0);
  }, [id, user]);

  const handleToggleLibrary = async () => {
    if (!user?.id || !book) return;

    try {
      if (isInLibrary) {
        await api.removeFromLibrary(user.id, book.id);
        setIsInLibrary(false);
        showToast(`Removed "${book.title}" from your library.`);
      } else {
        await api.addToLibrary(user.id, book.id, 'Currently Reading', 0);
        setIsInLibrary(true);
        showToast(`Added "${book.title}" to your library!`);
      }
    } catch (err) {
      showToast('Error updating library');
    }
  };

  const handleDownload = () => {
    // Generate clean student study notes / summary download
    const content = `E-BOOK STUDY SAMPLE\n\nTitle: ${book.title}\nAuthor: ${book.author}\nCategory: ${book.category}\nPublished: ${book.published_year}\nPages: ${book.pages}\n\nSYNOPSIS:\n${book.about_text || book.description}\n\nDownloaded via E-Book Management System - Student Mini Project`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/\s+/g, '_')}_Sample.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloading e-book sample for ${book.title}...`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="catalog-loading">
        <div className="spinner-blue" />
        <p>Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="catalog-empty">
        <h2>Book Not Found</h2>
        <p>The book you requested does not exist or has been removed.</p>
        <Link to="/catalog" className="btn-primary-auth" style={{ display: 'inline-block', maxWidth: '200px' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="book-details-page">
      {/* Toast Alert */}
      {toastMessage && <div className="floating-toast">{toastMessage}</div>}

      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <Link to="/catalog" className="breadcrumb-link">Library Catalog</Link>
        <ChevronRight size={16} color="#94A3B8" />
        <span className="breadcrumb-current">Book Details</span>
      </div>

      {/* Primary Details Hero Card */}
      <div className="details-hero-card">
        {/* Left: Large Book Cover */}
        <div className="details-cover-container">
          <BookCover
            title={book.title}
            author={book.author}
            color={book.cover_color || '#ea580c'}
            size="hero"
          />
        </div>

        {/* Right: Book Metadata & Action Buttons */}
        <div className="details-content-container">
          {/* Category Pill and Rating Header */}
          <div className="details-meta-header">
            <span className="details-category-pill">{book.category}</span>
            <div className="details-rating-badge">
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <span>{book.rating || 4.8}</span>
            </div>
          </div>

          {/* Book Title & Author */}
          <h1 className="details-title">{book.title}</h1>
          <p className="details-author">Author · {book.author}</p>

          {/* 2x3 Grid of Metadata Attribute Badges */}
          <div className="meta-attributes-grid">
            {/* 1. Published */}
            <div className="meta-attribute-box">
              <div className="meta-attr-icon">
                <Calendar size={18} color="#2563EB" />
              </div>
              <div>
                <span className="meta-attr-label">Published</span>
                <span className="meta-attr-val">{book.published_year || 2018}</span>
              </div>
            </div>

            {/* 2. Pages */}
            <div className="meta-attribute-box">
              <div className="meta-attr-icon">
                <Layers size={18} color="#2563EB" />
              </div>
              <div>
                <span className="meta-attr-label">Pages</span>
                <span className="meta-attr-val">{book.pages || 320}</span>
              </div>
            </div>

            {/* 3. Language */}
            <div className="meta-attribute-box">
              <div className="meta-attr-icon">
                <Globe size={18} color="#2563EB" />
              </div>
              <div>
                <span className="meta-attr-label">Language</span>
                <span className="meta-attr-val">{book.language || 'English'}</span>
              </div>
            </div>

            {/* 4. Format */}
            <div className="meta-attribute-box">
              <div className="meta-attr-icon">
                <FileText size={18} color="#2563EB" />
              </div>
              <div>
                <span className="meta-attr-label">Format</span>
                <span className="meta-attr-val">{book.file_format || 'PDF / EPUB'}</span>
              </div>
            </div>

            {/* 5. Availability */}
            <div className="meta-attribute-box">
              <div className="meta-attr-icon">
                <CheckCircle size={18} color="#2563EB" />
              </div>
              <div>
                <span className="meta-attr-label">Availability</span>
                <span className="meta-attr-val">{book.availability || 'Available now'}</span>
              </div>
            </div>

            {/* 6. File size */}
            <div className="meta-attribute-box">
              <div className="meta-attr-icon">
                <HardDrive size={18} color="#2563EB" />
              </div>
              <div>
                <span className="meta-attr-label">File size</span>
                <span className="meta-attr-val">{book.file_size || '8.4 MB'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="details-description">{book.description}</p>

          {/* Action Buttons Row */}
          <div className="details-actions-row">
            {/* Primary: Read Now */}
            <button 
              className="btn-read-now"
              onClick={() => setIsReaderOpen(true)}
            >
              <BookOpen size={18} />
              <span>Read Now</span>
            </button>

            {/* Secondary: Add / Remove Library */}
            <button 
              className={`btn-add-library ${isInLibrary ? 'in-library' : ''}`}
              onClick={handleToggleLibrary}
            >
              {isInLibrary ? (
                <>
                  <BookmarkCheck size={18} color="#2563EB" />
                  <span>In Library (Remove)</span>
                </>
              ) : (
                <>
                  <Bookmark size={18} color="#64748B" />
                  <span>Add to Library</span>
                </>
              )}
            </button>

            {/* Tertiary: Download */}
            <button className="btn-download" onClick={handleDownload}>
              <Download size={18} />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: About this Book */}
      <div className="about-book-card">
        <div className="about-left-header">
          <h3 className="about-title">About this Book</h3>
          <span className="about-year-text">First published in {book.published_year || 2018}</span>
        </div>

        <div className="about-center-text">
          <p>
            {book.about_text || book.description}
          </p>
        </div>

        <div className="about-right-stats">
          <div className="stat-highlight-box blue-stat">
            <span className="stat-big-val">{book.est_reading_time || '4h 52m'}</span>
            <span className="stat-small-label">Est. reading</span>
          </div>

          <div className="stat-highlight-box green-stat">
            <span className="stat-big-val">{book.student_reads || '12,480'}</span>
            <span className="stat-small-label">Student reads</span>
          </div>
        </div>
      </div>

      {/* SECTION: Related Books */}
      <div className="related-books-section">
        <div className="section-header">
          <h3 className="section-title">Related Books</h3>
          <Link to="/catalog" className="section-link">View all</Link>
        </div>

        <div className="related-books-grid">
          {relatedBooks.map((rel) => (
            <div 
              key={rel.id} 
              className="recently-added-card"
              onClick={() => navigate(`/book/${rel.id}`)}
            >
              <div className="recent-cover-box">
                <BookCover
                  title={rel.title}
                  author={rel.author}
                  color={rel.cover_color || '#0e7490'}
                  size="sm"
                />
              </div>

              <div className="recent-info-box">
                <h4 className="recent-title">{rel.title}</h4>
                <p className="recent-author">by {rel.author}</p>

                <div className="recent-meta-row">
                  <span className="recent-category-link">{rel.category}</span>
                  <div className="rating-pill">
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <span>{rel.rating || 4.7}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Reader Modal */}
      {isReaderOpen && (
        <ReaderModal
          book={book}
          initialProgress={readingProgress}
          onClose={() => setIsReaderOpen(false)}
          onProgressUpdated={(newProg, newStat) => {
            setReadingProgress(newProg);
            setReadingStatus(newStat);
            setIsInLibrary(true);
          }}
        />
      )}
    </div>
  );
}
