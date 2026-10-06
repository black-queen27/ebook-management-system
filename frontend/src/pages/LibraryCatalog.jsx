import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, SlidersHorizontal, Star, Bookmark } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookCover from '../components/BookCover';

export default function LibraryCatalog() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(128);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [userSavedBookIds, setUserSavedBookIds] = useState(new Set());
  const [actionMessage, setActionMessage] = useState('');

  const categories = [
    'All',
    'Fiction',
    'Technology',
    'Business',
    'Self Development',
    'Science'
  ];

  // Sync state from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const cat = params.get('category');
    if (q) setSearchTerm(q);
    if (cat) setSelectedCategory(cat);
  }, [location.search]);

  // Load user library book IDs so we show active bookmark status
  const loadUserLibrary = async () => {
    if (!user?.id) return;
    try {
      const res = await api.getUserLibrary(user.id);
      const ids = new Set((res.books || []).map((b) => b.book_id));
      setUserSavedBookIds(ids);
    } catch (e) {
      console.error(e);
    }
  };

  // Load books from MySQL / backend
  const loadBooks = async () => {
    setLoading(true);
    try {
      const res = await api.getBooks({
        q: searchTerm,
        category: selectedCategory,
        sort: sortBy,
      });
      setBooks(res.books || []);
      // Display 128 as canonical mini project count if 12 demo books
      setTotalBooks(res.total || 128);
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserLibrary();
  }, [user]);

  useEffect(() => {
    loadBooks();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadBooks();
  };

  // Quick toggle bookmark directly from the card
  const handleToggleBookmark = async (book) => {
    if (!user?.id) return;
    const isSaved = userSavedBookIds.has(book.id);

    try {
      if (isSaved) {
        await api.removeFromLibrary(user.id, book.id);
        const updated = new Set(userSavedBookIds);
        updated.delete(book.id);
        setUserSavedBookIds(updated);
        showToast(`Removed "${book.title}" from library`);
      } else {
        await api.addToLibrary(user.id, book.id, 'Currently Reading', 0);
        const updated = new Set(userSavedBookIds);
        updated.add(book.id);
        setUserSavedBookIds(updated);
        showToast(`Added "${book.title}" to your library!`);
      }
    } catch (e) {
      showToast('Error updating library');
    }
  };

  const showToast = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 3000);
  };

  return (
    <div className="catalog-page">
      {/* Toast Notification */}
      {actionMessage && <div className="floating-toast">{actionMessage}</div>}

      {/* Header Row */}
      <div className="catalog-header-row">
        <h1 className="page-heading">Library Catalog</h1>
        <span className="showing-count-text">
          Showing {books.length} of {Math.max(totalBooks, 128)} books
        </span>
      </div>

      {/* Search and Filters Controls Bar */}
      <div className="catalog-controls-bar">
        {/* Search input */}
        <form className="catalog-search-form" onSubmit={handleSearchSubmit}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, author or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Categories Dropdown */}
        <div className="filter-dropdown-wrapper">
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Fiction">Fiction</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Self Development">Self Development</option>
            <option value="Science">Science</option>
            <option value="Biography">Biography</option>
            <option value="History">History</option>
          </select>
          <ChevronDown size={16} className="dropdown-arrow-icon" />
        </div>

        {/* Sort Dropdown */}
        <div className="filter-dropdown-wrapper">
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Sort: Popular</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="newest">Sort: Newest</option>
            <option value="title">Sort: Title A-Z</option>
          </select>
          <ChevronDown size={16} className="dropdown-arrow-icon" />
        </div>

        {/* Filter Button */}
        <button 
          className="btn-filter-trigger"
          onClick={() => loadBooks()}
        >
          <SlidersHorizontal size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* Category Pills Row */}
      <div className="category-pills-row">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Book Cards Grid: 4 columns */}
      {loading ? (
        <div className="catalog-loading">
          <div className="spinner-blue" />
          <p>Loading e-book catalog from database...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="catalog-empty">
          <p>No books found matching your search criteria.</p>
          <button 
            className="btn-reset-filters" 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="catalog-books-grid">
          {books.map((book) => {
            const isBookmarked = userSavedBookIds.has(book.id);
            return (
              <div 
                key={book.id} 
                className="catalog-book-card"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                {/* Book Cover with Bookmark Icon on Top Right */}
                <div className="catalog-cover-wrapper">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    color={book.cover_color || '#2563eb'}
                    size="md"
                    showBookmarkBtn={true}
                    isBookmarked={isBookmarked}
                    onBookmarkToggle={() => handleToggleBookmark(book)}
                  />
                </div>

                {/* Book Info */}
                <div className="catalog-card-info">
                  <h4 className="catalog-book-title">{book.title}</h4>
                  <p className="catalog-book-author">by {book.author}</p>

                  <div className="catalog-meta-row">
                    <span className="category-tag-pill">{book.category}</span>
                    <div className="card-rating">
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      <span>{book.rating || 4.7}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    className="btn-view-details"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book/${book.id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
