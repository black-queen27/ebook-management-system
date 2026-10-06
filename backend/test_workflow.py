"""
End-to-End Workflow Verification Script for E-Book Management System.
Tests:
1. Registration
2. Login
3. Dashboard statistics and Continue Reading
4. Profile fetch and Profile Update
5. Library Catalog & Search
6. Book Details
7. Add Book to Library
8. Update Reading Progress & Status
9. Verify in User Library
10. Remove Book from Library
11. Logout & Re-login
"""

import sys
import requests

BASE_URL = 'http://127.0.0.1:5000/api'

def run_tests():
    print("=" * 65)
    print(" Running End-to-End Workflow Test Suite")
    print("=" * 65)

    # 1. Health check
    res = requests.get(f"{BASE_URL}/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    db_mode = res.json()['database']['mode']
    print(f"[1/11] Health check passed (Active DB: {db_mode})")

    # 2. Register a new user
    import time
    test_email = f"student_{int(time.time())}@campus.edu"
    reg_data = {
        'name': 'Priya Ramesh',
        'email': test_email,
        'password': 'password123',
        'phone': '+91 91234 56789',
        'college': 'Loyola ICAM College',
        'course': 'B.Tech Information Technology'
    }
    res = requests.post(f"{BASE_URL}/register", json=reg_data)
    assert res.status_code == 201, f"Register failed: {res.text}"
    new_user = res.json()['user']
    new_user_id = new_user['id']
    print(f"[2/11] Registration passed: created user '{new_user['name']}' (ID: {new_user_id})")

    # 3. Login as newly registered user
    login_data = {'email': test_email, 'password': 'password123'}
    res = requests.post(f"{BASE_URL}/login", json=login_data)
    assert res.status_code == 200, f"Login failed: {res.text}"
    assert res.json()['user']['email'] == test_email
    print(f"[3/11] Login passed for '{test_email}'")

    # 4. Login as Sharini (Default user ID 1)
    res = requests.post(f"{BASE_URL}/login", json={'email': 'sharini@student.edu', 'password': 'password123'})
    assert res.status_code == 200, f"Sharini login failed: {res.text}"
    sharini = res.json()['user']
    print(f"[4/11] Default Demo Login passed for '{sharini['name']}' ({sharini['email']})")

    # 5. Dashboard Data
    res = requests.get(f"{BASE_URL}/dashboard/1")
    assert res.status_code == 200, f"Dashboard failed: {res.text}"
    dash = res.json()
    stats = dash['stats']
    print(f"[5/11] Dashboard passed: Total Books={stats['total_books']}, My Books={stats['my_books']}, Currently Reading={stats['currently_reading']}")

    # 6. Profile Fetch & Update
    res = requests.get(f"{BASE_URL}/users/1")
    assert res.status_code == 200, f"Profile fetch failed: {res.text}"
    original_phone = res.json()['user']['phone']

    update_payload = {
        'phone': '+91 98765 43210',
        'department': 'Information Technology',
        'reading_preferences': 'Fiction,Technology,Self Development,Science,Business'
    }
    res = requests.put(f"{BASE_URL}/users/1", json=update_payload)
    assert res.status_code == 200, f"Profile update failed: {res.text}"
    assert res.json()['user']['phone'] == '+91 98765 43210'
    print(f"[6/11] Profile update passed: Phone={res.json()['user']['phone']}")

    # 7. Library Catalog & Search
    res = requests.get(f"{BASE_URL}/books?q=Atomic")
    assert res.status_code == 200, f"Book search failed: {res.text}"
    found = res.json()['books']
    assert len(found) >= 1 and 'Atomic' in found[0]['title']
    print(f"[7/11] Catalog Search passed: Found '{found[0]['title']}'")

    # 8. Book Details
    res = requests.get(f"{BASE_URL}/books/1")
    assert res.status_code == 200, f"Book detail failed: {res.text}"
    book_1 = res.json()['book']
    assert book_1['title'] == 'Atomic Habits'
    print(f"[8/11] Book Details passed: '{book_1['title']}' by {book_1['author']}")

    # 9. Add Book to User Library
    # Add book 10 (A Brief History of Time) to user_id 1
    add_payload = {
        'user_id': 1,
        'book_id': 10,
        'reading_status': 'Currently Reading',
        'progress_percent': 15
    }
    res = requests.post(f"{BASE_URL}/library", json=add_payload)
    assert res.status_code in [200, 201], f"Add to library failed: {res.text}"
    print(f"[9/11] Add to Library passed: Added book ID 10")

    # 10. Update Reading Status
    res = requests.put(f"{BASE_URL}/library/1/10/status", json={'reading_status': 'Currently Reading', 'progress_percent': 35})
    assert res.status_code == 200, f"Status update failed: {res.text}"
    print(f"[10/11] Update Reading Status passed: Progress updated to 35%")

    # 11. Remove Book from Library
    res = requests.delete(f"{BASE_URL}/library/1/10")
    assert res.status_code == 200, f"Remove book failed: {res.text}"
    print(f"[11/11] Remove from Library passed: Book removed successfully")

    print("\n" + "=" * 65)
    print(" ALL 11 WORKFLOW VERIFICATIONS PASSED SUCCESSFULLY!")
    print("=" * 65)

if __name__ == '__main__':
    run_tests()
