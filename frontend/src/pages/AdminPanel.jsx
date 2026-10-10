import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  BookPlus, 
  Trash2, 
  Edit3, 
  Users, 
  BookOpen, 
  Layers, 
  Search, 
  CheckCircle2, 
  X, 
  Plus, 
  Star,
  Library
} from 'lucide-react';
import { api } from '../services/api';
import BookCover from '../components/BookCover';

export default function AdminPanel() {
  const [stats, setStats] = useState({
    total_students: 0,
    total_books: 0,
    active_loans: 0,
    completed_reads: 0,
  });
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'students'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Technology',
    cover_color: '#2563EB',
    published_year: 2024,
    pages: 320,
    description: '',
    rating: 4.8,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, booksRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getBooks({ limit: 100 }),
        api.getAllUsers(),
      ]);

      setStats(statsRes.stats || {});
      setBooks(booksRes.books || []);
      setStudents(usersRes.users || []);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingBookId(null);
    setFormData({
      title: '',
      author: '',
      category: 'Technology',
      cover_color: '#2563EB',
      published_year: 2024,
      pages: 320,
      description: '',
      rating: 4.8,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book) => {
    setEditingBookId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      cover_color: book.cover_color || '#2563EB',
      published_year: book.published_year || 2024,
      pages: book.pages || 320,
      description: book.description || '',
      rating: book.rating || 4.8,
    });
    setIsModalOpen(true);
  };

  const handleSubmitBook = async (e) => {
    e.preventDefault();
    try {
      if (editingBookId) {
        await api.updateBook(editingBookId, formData);
        showToast(`Book "${formData.title}" updated successfully!`);
      } else {
        await api.addBook(formData);
        showToast(`Book "${formData.title}" added to catalog!`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Operation failed');
    }
  };

  const handleDeleteBook = async (book) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${book.title}" from the catalog?`)) {
      return;
    }
    try {
      await api.deleteBook(book.id);
      showToast(`Deleted "${book.title}" from catalog.`);
      loadData();
    } catch (err) {
      showToast('Failed to delete book');
    }
  };

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="catalog-page">
      {/* Toast Alert */}
      {toastMsg && <div className="floating-toast success-toast">{toastMsg}</div>}

      {/* Header */}
      <div className="catalog-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShieldCheck size={24} color="#2563EB" />
            <h1 className="page-heading">Admin Control Center</h1>
          </div>
          <p className="page-subheading">
            Manage catalog collection, add or edit e-books, and monitor student reading activity.
          </p>
        </div>

        <button className="btn-save-profile" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box blue-bg">
            <Library size={22} color="#2563EB" />
          </div>
          <div className="metric-content">
            <span className="metric-value">{stats.total_books || books.length}</span>
            <span className="metric-label">Books in Catalog</span>
            <span className="metric-trend blue-text">Active Inventory</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box purple-bg">
            <Users size={22} color="#9333EA" />
          </div>
          <div className="metric-content">
            <span className="metric-value">{stats.total_students || students.length}</span>
            <span className="metric-label">Registered Students</span>
            <span className="metric-trend purple-text">Campus Accounts</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box amber-bg">
            <BookOpen size={22} color="#D97706" />
          </div>
          <div className="metric-content">
            <span className="metric-value">{stats.active_loans || 3}</span>
            <span className="metric-label">Active Readers</span>
            <span className="metric-trend amber-text">Currently In-Progress</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box green-bg">
            <CheckCircle2 size={22} color="#16A34A" />
          </div>
          <div className="metric-content">
            <span className="metric-value">{stats.completed_reads || 4}</span>
            <span className="metric-label">Completed Reads</span>
            <span className="metric-trend green-text">Total Finished</span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="library-tabs-row" style={{ marginTop: '12px' }}>
        <button
          className={`library-tab-btn ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => setActiveTab('books')}
        >
          <BookOpen size={16} />
          <span>Manage Books</span>
          <span className="tab-counter">{books.length}</span>
        </button>

        <button
          className={`library-tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <Users size={16} />
          <span>Registered Students</span>
          <span className="tab-counter">{students.length}</span>
        </button>
      </div>

      {/* TAB 1: Books Management */}
      {activeTab === 'books' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Search bar */}
          <div className="catalog-search-form" style={{ maxWidth: '460px' }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search books by title, author or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Books Table */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 600 }}>
                  <th style={{ padding: '14px 20px' }}>Cover</th>
                  <th style={{ padding: '14px 20px' }}>Title & Author</th>
                  <th style={{ padding: '14px 20px' }}>Category</th>
                  <th style={{ padding: '14px 20px' }}>Published</th>
                  <th style={{ padding: '14px 20px' }}>Pages</th>
                  <th style={{ padding: '14px 20px' }}>Rating</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 20px', width: '70px' }}>
                      <BookCover title={b.title} author={b.author} color={b.cover_color} size="xs" />
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <strong style={{ color: '#0F172A', display: 'block', fontSize: '14px' }}>{b.title}</strong>
                      <span style={{ color: '#64748B', fontSize: '12.5px' }}>by {b.author}</span>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span className="category-tag-pill">{b.category}</span>
                    </td>
                    <td style={{ padding: '12px 20px', color: '#475569' }}>{b.published_year}</td>
                    <td style={{ padding: '12px 20px', color: '#475569' }}>{b.pages} pages</td>
                    <td style={{ padding: '12px 20px' }}>
                      <div className="rating-pill">
                        <Star size={14} color="#F59E0B" fill="#F59E0B" />
                        <span>{b.rating || 4.8}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#2563EB',
                          }}
                          onClick={() => handleOpenEditModal(b)}
                        >
                          <Edit3 size={14} /> Edit
                        </button>

                        <button
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #FEE2E2',
                            backgroundColor: '#FEF2F2',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#EF4444',
                          }}
                          onClick={() => handleDeleteBook(b)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Students List */}
      {activeTab === 'students' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 600 }}>
                <th style={{ padding: '14px 20px' }}>ID</th>
                <th style={{ padding: '14px 20px' }}>Student Name</th>
                <th style={{ padding: '14px 20px' }}>Email Address</th>
                <th style={{ padding: '14px 20px' }}>College / Institution</th>
                <th style={{ padding: '14px 20px' }}>Course & Year</th>
                <th style={{ padding: '14px 20px' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px', color: '#64748B' }}>#{s.id}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <strong style={{ color: '#0F172A' }}>{s.name}</strong>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#2563EB' }}>{s.email}</td>
                  <td style={{ padding: '14px 20px', color: '#475569' }}>{s.college || 'Loyola ICAM College'}</td>
                  <td style={{ padding: '14px 20px', color: '#475569' }}>
                    {s.course} ({s.year_of_study || '2nd Year'})
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: s.role === 'Admin' ? '#FEF3C7' : '#EFF6FF',
                        color: s.role === 'Admin' ? '#D97706' : '#2563EB',
                      }}
                    >
                      {s.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Book Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="reader-modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="reader-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookPlus size={20} color="#2563EB" />
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {editingBookId ? 'Edit Book Details' : 'Add New E-Book to Catalog'}
                </h4>
              </div>
              <button className="reader-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitBook} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="fields-2x2-grid">
                <div className="field-group">
                  <label>Book Title *</label>
                  <input
                    type="text"
                    required
                    style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label>Author Name *</label>
                  <input
                    type="text"
                    required
                    style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
              </div>

              <div className="fields-2x2-grid">
                <div className="field-group">
                  <label>Category</label>
                  <select
                    style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Self Development">Self Development</option>
                    <option value="Business">Business</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Science">Science</option>
                    <option value="Biography">Biography</option>
                    <option value="History">History</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>Cover Jacket Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="color"
                      style={{ width: '42px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                      value={formData.cover_color}
                      onChange={(e) => setFormData({ ...formData, cover_color: e.target.value })}
                    />
                    <code style={{ fontSize: '13px' }}>{formData.cover_color}</code>
                  </div>
                </div>
              </div>

              <div className="fields-2x2-grid">
                <div className="field-group">
                  <label>Published Year</label>
                  <input
                    type="number"
                    style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                    value={formData.published_year}
                    onChange={(e) => setFormData({ ...formData, published_year: Number(e.target.value) })}
                  />
                </div>

                <div className="field-group">
                  <label>Number of Pages</label>
                  <input
                    type="number"
                    style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Description & Synopsis</label>
                <textarea
                  rows="3"
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13.5px', fontFamily: 'inherit', resize: 'vertical' }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn-cancel-profile"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save-profile">
                  {editingBookId ? 'Save Changes' : 'Create Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
