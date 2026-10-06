"""
User profile management routes.
"""

from flask import Blueprint, request, jsonify
from database import query_db, modify_db

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    """Retrieve full user profile details."""
    user = query_db(
        """SELECT id, name, email, phone, education, college, course, 
                  year_of_study, department, date_of_birth, reading_preferences, 
                  avatar_url, role, created_at 
           FROM users WHERE id = %s""",
        (user_id,),
        one=True
    )
    if not user:
        return jsonify({'success': False, 'message': 'User not found.'}), 404

    return jsonify({'success': True, 'user': user}), 200

@users_bp.route('/<int:user_id>', methods=['PUT'])
def update_user_profile(user_id):
    """Update profile information for the given user."""
    data = request.get_json() or {}

    user = query_db("SELECT id FROM users WHERE id = %s", (user_id,), one=True)
    if not user:
        return jsonify({'success': False, 'message': 'User not found.'}), 404

    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    college = data.get('college')
    course = data.get('course')
    year_of_study = data.get('year_of_study')
    department = data.get('department')
    date_of_birth = data.get('date_of_birth')
    reading_preferences = data.get('reading_preferences')
    education = data.get('education', course)

    # Check email conflict if email changed
    if email:
        existing = query_db("SELECT id FROM users WHERE email = %s AND id != %s", (email, user_id), one=True)
        if existing:
            return jsonify({'success': False, 'message': 'Email is already in use by another account.'}), 409

    query = """
        UPDATE users 
        SET name = COALESCE(%s, name),
            email = COALESCE(%s, email),
            phone = COALESCE(%s, phone),
            college = COALESCE(%s, college),
            course = COALESCE(%s, course),
            education = COALESCE(%s, education),
            year_of_study = COALESCE(%s, year_of_study),
            department = COALESCE(%s, department),
            date_of_birth = COALESCE(%s, date_of_birth),
            reading_preferences = COALESCE(%s, reading_preferences)
        WHERE id = %s
    """
    args = (name, email, phone, college, course, education, year_of_study, department, date_of_birth, reading_preferences, user_id)

    try:
        modify_db(query, args)
        updated_user = query_db(
            """SELECT id, name, email, phone, education, college, course, 
                      year_of_study, department, date_of_birth, reading_preferences, 
                      avatar_url, role, created_at 
               FROM users WHERE id = %s""",
            (user_id,),
            one=True
        )
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully!',
            'user': updated_user
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'Failed to update profile: {str(e)}'}), 500
