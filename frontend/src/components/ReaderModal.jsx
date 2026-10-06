import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReaderModal({ book, initialProgress = 0, onClose, onProgressUpdated }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(initialProgress);
  const [chapter, setChapter] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!book) return null;

  const handleSaveProgress = async (newProgress, status = null) => {
    setSaving(true);
    try {
      const finalStatus = status || (newProgress >= 100 ? 'Completed' : 'Currently Reading');
      await api.addToLibrary(user.id, book.id, finalStatus, newProgress);
      setProgress(newProgress);
      setSaveMessage(`Progress saved: ${newProgress}% (${finalStatus})`);
      if (onProgressUpdated) onProgressUpdated(newProgress, finalStatus);
      setTimeout(() => setSaveMessage(''), 2500);
    } catch (err) {
      setSaveMessage('Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkCompleted = () => {
    handleSaveProgress(100, 'Completed');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="reader-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="reader-header">
          <div className="reader-book-title-group">
            <BookOpen size={20} color="#2563EB" />
            <div>
              <h4 className="reader-book-title">{book.title}</h4>
              <p className="reader-book-author">by {book.author} · Chapter {chapter}</p>
            </div>
          </div>

          <div className="reader-header-actions">
            <span className="reader-progress-badge">{progress}% Read</span>
            <button className="reader-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar Top */}
        <div className="reader-progress-track">
          <div className="reader-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Reader Book Content */}
        <div className="reader-body">
          <div className="chapter-content">
            <h3>Chapter {chapter}: The Fundamentals of Habit Formation</h3>
            <p className="lead-paragraph">
              {book.about_text || book.description || 'Welcome to your reading session. Here you can read excerpts, study chapters, and track your learning progress.'}
            </p>

            <p>
              Changes that seem small and unimportant at first will compound into remarkable results if you are willing to stick with them for years. We all deal with setbacks, but in the long run, the quality of our lives often depends on the quality of our habits.
            </p>

            <blockquote>
              "You do not rise to the level of your goals. You fall to the level of your systems."
            </blockquote>

            <p>
              With the same habits, you’ll end up with the same results. But with better habits, anything is possible. When successful people talk about their achievements, they often credit routines and deliberate consistency.
            </p>

            <div className="reader-page-indicator">
              Page {chapter * 24} of {book.pages || 320}
            </div>
          </div>
        </div>

        {/* Reader Controls Footer */}
        <div className="reader-footer">
          <div className="reader-slider-group">
            <label>Update Progress:</label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
            />
            <span className="slider-val">{progress}%</span>
            <button
              className="btn-save-progress"
              disabled={saving}
              onClick={() => handleSaveProgress(progress)}
            >
              {saving ? 'Saving...' : 'Save Progress'}
            </button>
          </div>

          <div className="reader-footer-actions">
            <button
              className="btn-mark-completed"
              onClick={handleMarkCompleted}
            >
              <CheckCircle size={16} />
              <span>Mark as Completed</span>
            </button>

            {saveMessage && <span className="save-toast">{saveMessage}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
