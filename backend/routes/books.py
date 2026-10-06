"""
Books catalog, search, and detail routes.
"""

from flask import Blueprint, request, jsonify
from database import query_db

books_bp = Blueprint('books', __name__, url_prefix='/api/books')

@books_bp.route('', methods=['GET'])
def get_books():
    """Fetch books with optional search, category filter, and sorting."""
    search = request.args.get('q', '').strip()
    category = request.args.get('category', '').strip()
    sort_by = request.args.get('sort', 'popular').lower()
    limit = request.args.get('limit', type=int)
    offset = request.args.get('offset', default=0, type=int)

    base_query = "SELECT * FROM books WHERE 1=1"
    params = []

    if search:
        base_query += " AND (title LIKE %s OR author LIKE %s OR category LIKE %s)"
        like_search = f"%{search}%"
        params.extend([like_search, like_search, like_search])

    if category and category.lower() != 'all':
        base_query += " AND LOWER(category) = LOWER(%s)"
        params.append(category)

    # Order by
    if sort_by == 'newest':
        base_query += " ORDER BY published_year DESC, id DESC"
    elif sort_by == 'title':
        base_query += " ORDER BY title ASC"
    elif sort_by == 'rating':
        base_query += " ORDER BY rating DESC"
    else:  # popular
        base_query += " ORDER BY rating DESC, id ASC"

    # Get total count
    count_query = f"SELECT COUNT(*) as total FROM ({base_query}) as sub"
    total_result = query_db(count_query, params, one=True)
    total_books = total_result['total'] if total_result else 0

    if limit:
        base_query += " LIMIT %s OFFSET %s"
        params.extend([limit, offset])

    books = query_db(base_query, params)
    return jsonify({
        'success': True,
        'count': len(books),
        'total': total_books,
        'books': books
    }), 200

@books_bp.route('/<int:book_id>', methods=['GET'])
def get_book_by_id(book_id):
    """Retrieve detailed information for a single book including related recommendations."""
    book = query_db("SELECT * FROM books WHERE id = %s", (book_id,), one=True)
    if not book:
        return jsonify({'success': False, 'message': 'Book not found.'}), 404

    # Fetch related books (same category or others, excluding current book)
    related = query_db(
        "SELECT * FROM books WHERE id != %s ORDER BY (category = %s) DESC, rating DESC LIMIT 4",
        (book_id, book['category'])
    )

    return jsonify({
        'success': True,
        'book': book,
        'related_books': related
    }), 200

@books_bp.route('/categories', methods=['GET'])
def get_categories():
    """Retrieve all book categories and count of books in each."""
    categories = query_db(
        "SELECT category, COUNT(*) as count FROM books GROUP BY category ORDER BY count DESC"
    )
    return jsonify({
        'success': True,
        'categories': categories
    }), 200
