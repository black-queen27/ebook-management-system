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

@books_bp.route('', methods=['POST'])
def add_book():
    """Add a new book to the catalog (Admin action)."""
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    author = data.get('author', '').strip()
    category = data.get('category', 'Technology').strip()
    description = data.get('description', '').strip()
    about_text = data.get('about_text', description).strip()
    cover_color = data.get('cover_color', '#2563EB')
    published_year = data.get('published_year', 2024)
    pages = data.get('pages', 300)
    language = data.get('language', 'English')
    file_format = data.get('file_format', 'PDF / EPUB')
    file_size = data.get('file_size', '7.5 MB')
    rating = data.get('rating', 4.8)

    if not title or not author:
        return jsonify({'success': False, 'message': 'Title and author are required.'}), 400

    query = """
        INSERT INTO books (title, author, category, description, about_text, cover_color, 
                           published_year, pages, language, file_format, file_size, rating)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    args = (title, author, category, description, about_text, cover_color,
            published_year, pages, language, file_format, file_size, rating)

    from database import modify_db
    try:
        res = modify_db(query, args)
        new_id = res['lastrowid']
        new_book = query_db("SELECT * FROM books WHERE id = %s", (new_id,), one=True)
        return jsonify({
            'success': True,
            'message': f'Book "{title}" added to catalog successfully!',
            'book': new_book
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'message': f'Failed to add book: {str(e)}'}), 500

@books_bp.route('/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    """Update existing book details (Admin action)."""
    data = request.get_json() or {}
    title = data.get('title')
    author = data.get('author')
    category = data.get('category')
    description = data.get('description')
    cover_color = data.get('cover_color')
    published_year = data.get('published_year')
    pages = data.get('pages')
    rating = data.get('rating')

    query = """
        UPDATE books 
        SET title = COALESCE(%s, title),
            author = COALESCE(%s, author),
            category = COALESCE(%s, category),
            description = COALESCE(%s, description),
            about_text = COALESCE(%s, about_text),
            cover_color = COALESCE(%s, cover_color),
            published_year = COALESCE(%s, published_year),
            pages = COALESCE(%s, pages),
            rating = COALESCE(%s, rating)
        WHERE id = %s
    """
    args = (title, author, category, description, description, cover_color, published_year, pages, rating, book_id)

    from database import modify_db
    try:
        res = modify_db(query, args)
        if res['rowcount'] == 0:
            return jsonify({'success': False, 'message': 'Book not found or no changes made.'}), 404
        updated = query_db("SELECT * FROM books WHERE id = %s", (book_id,), one=True)
        return jsonify({
            'success': True,
            'message': 'Book updated successfully!',
            'book': updated
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'Failed to update book: {str(e)}'}), 500

@books_bp.route('/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    """Delete a book from the catalog (Admin action)."""
    from database import modify_db
    try:
        res = modify_db("DELETE FROM books WHERE id = %s", (book_id,))
        if res['rowcount'] > 0:
            return jsonify({'success': True, 'message': 'Book deleted from catalog successfully!'}), 200
        else:
            return jsonify({'success': False, 'message': 'Book not found.'}), 404
    except Exception as e:
        return jsonify({'success': False, 'message': f'Failed to delete book: {str(e)}'}), 500

