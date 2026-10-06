import React from 'react';
import { Bookmark, BookOpen } from 'lucide-react';

export default function BookCover({
  title = '',
  author = '',
  color = '#2563EB',
  size = 'md',
  isBookmarked = false,
  onBookmarkToggle = null,
  showBookmarkBtn = false,
  subtitle = ''
}) {
  // Dimensions for different placements
  const sizeMap = {
    xs: { width: '48px', height: '64px', titleSize: '9px', padding: '6px', iconSize: 12 },
    sm: { width: '80px', height: '110px', titleSize: '11px', padding: '8px', iconSize: 14 },
    md: { width: '100%', height: '220px', titleSize: '15px', padding: '16px', iconSize: 16 },
    lg: { width: '140px', height: '190px', titleSize: '13px', padding: '12px', iconSize: 16 },
    hero: { width: '280px', height: '390px', titleSize: '24px', padding: '28px', iconSize: 24 }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Derive short subtitle or tagline if not provided
  const displaySubtitle = subtitle || (
    title.toLowerCase().includes('atomic') ? 'Tiny Changes, Remarkable Results' :
    title.toLowerCase().includes('alchemist') ? 'A fable about following your dream' :
    title.toLowerCase().includes('clean code') ? 'A handbook of agile craftsmanship' :
    author ? `by ${author}` : ''
  );

  return (
    <div
      className="book-cover-container"
      style={{
        width: currentSize.width,
        height: currentSize.height,
        backgroundColor: color,
        borderRadius: size === 'hero' ? '16px' : '12px',
        position: 'relative',
        boxShadow: '0 8px 20px rgba(0,0,0,0.12), inset 4px 0 8px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: currentSize.padding,
        color: '#FFFFFF',
        overflow: 'hidden',
        userSelect: 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Subtle spine gradient on left edge */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: size === 'hero' ? '12px' : '8px',
          background: 'linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.05), transparent)',
          zIndex: 1,
        }}
      />

      {/* Floating Bookmark Button on Top Right (used in Catalog view) */}
      {showBookmarkBtn && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onBookmarkToggle) onBookmarkToggle();
          }}
          title={isBookmarked ? 'Remove from Library' : 'Save to Library'}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            zIndex: 3,
            transition: 'transform 0.15s ease, background-color 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Bookmark
            size={16}
            color={isBookmarked ? '#2563EB' : '#64748B'}
            fill={isBookmarked ? '#2563EB' : 'none'}
          />
        </button>
      )}

      {/* Top Graphic Accent Bar */}
      <div style={{ zIndex: 2 }}>
        <div
          style={{
            width: size === 'hero' ? '44px' : '28px',
            height: size === 'hero' ? '5px' : '3px',
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: '2px',
            marginBottom: size === 'hero' ? '24px' : '10px',
          }}
        />
      </div>

      {/* Center Title & Tagline */}
      <div
        style={{
          zIndex: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: size === 'hero' ? 'flex-start' : 'center',
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: currentSize.titleSize,
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: size === 'hero' ? '0.5px' : 'normal',
            textTransform: size === 'hero' ? 'uppercase' : 'none',
            color: '#FFFFFF',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          {title}
        </h4>

        {displaySubtitle && (size === 'hero' || size === 'md') && (
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: size === 'hero' ? '13px' : '10px',
              fontWeight: 400,
              opacity: 0.85,
              lineHeight: 1.3,
            }}
          >
            {displaySubtitle}
          </p>
        )}
      </div>

      {/* Bottom Bar & Bookmark/Book Icon */}
      <div
        style={{
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: size === 'hero' ? '14px' : '6px',
        }}
      >
        <div
          style={{
            width: size === 'hero' ? '24px' : '16px',
            height: '2px',
            backgroundColor: 'rgba(255,255,255,0.6)',
          }}
        />
        <BookOpen size={currentSize.iconSize} color="rgba(255,255,255,0.85)" />
      </div>
    </div>
  );
}
