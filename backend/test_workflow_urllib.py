"""
Zero-dependency End-to-End Workflow Verification Script for E-Book Management System.
Uses Python's standard library urllib.request.
"""

import json
import time
import urllib.request
import urllib.error

BASE_URL = 'http://127.0.0.1:5000/api'

def req(path, method='GET', data=None):
    url = f"{BASE_URL}{path}"
    headers = {'Content-Type': 'application/json'}
    body = json.dumps(data).encode('utf-8') if data else None
    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request) as response:
            res_body = response.read().decode('utf-8')
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        return e.code, json.loads(err_body) if err_body else {}

def run_tests():
    print("=" * 65)
    print(" Running End-to-End Workflow Test Suite (Standard Library)")
    print("=" * 65)

    # 1. Health check
    status, body = req('/health')
    assert status == 200, f"Health check failed: {body}"
    print(f"[1/11] Health check passed (DB Mode: {body['database']['mode']})")

    # 2. Register
    test_email = f"student_{int(time.time())}@campus.edu"
    reg_data = {
        'name': 'Priya Ramesh',
        'email': test_email,
        'password': 'password123',
        'phone': '+91 91234 56789',
        'college': 'Loyola ICAM College',
        'course': 'B.Tech Information Technology'
    }
    status, body = req('/register', method='POST', data=reg_data)
    assert status == 201, f"Register failed: {body}"
    print(f"[2/11] Registration passed for '{body['user']['name']}' (ID: {body['user']['id']})")

    # 3. Login as new user
    status, body = req('/login', method='POST', data={'email': test_email, 'password': 'password123'})
    assert status == 200, f"Login failed: {body}"
    print(f"[3/11] Login passed for '{test_email}'")

    # 4. Login as Sharini
    status, body = req('/login', method='POST', data={'email': 'sharini@student.edu', 'password': 'password123'})
    assert status == 200, f"Sharini login failed: {body}"
    print(f"[4/11] Demo Login passed for '{body['user']['name']}'")

    # 5. Dashboard Data
    status, body = req('/dashboard/1')
    assert status == 200, f"Dashboard failed: {body}"
    stats = body['stats']
    print(f"[5/11] Dashboard metrics: Total Books={stats['total_books']}, My Books={stats['my_books']}, Reading={stats['currently_reading']}")

    # 6. Profile fetch & update
    status, body = req('/users/1')
    assert status == 200, f"Profile fetch failed: {body}"
    update_data = {
        'phone': '+91 98765 43210',
        'department': 'Information Technology'
    }
    status, body = req('/users/1', method='PUT', data=update_data)
    assert status == 200, f"Profile update failed: {body}"
    print(f"[6/11] Profile update persisted: Phone={body['user']['phone']}")

    # 7. Catalog Search
    status, body = req('/books?q=Atomic')
    assert status == 200, f"Book search failed: {body}"
    assert len(body['books']) >= 1
    print(f"[7/11] Catalog search found: '{body['books'][0]['title']}'")

    # 8. Book Details
    status, body = req('/books/1')
    assert status == 200, f"Book detail failed: {body}"
    print(f"[8/11] Book details retrieved: '{body['book']['title']}' (Author: {body['book']['author']})")

    # 9. Add Book to User Library
    add_data = {'user_id': 1, 'book_id': 10, 'reading_status': 'Currently Reading', 'progress_percent': 20}
    status, body = req('/library', method='POST', data=add_data)
    assert status in [200, 201], f"Add to library failed: {body}"
    print(f"[9/11] Add Book to Library passed (Book ID 10)")

    # 10. Update Reading Progress & Status
    status, body = req('/library/1/10/status', method='PUT', data={'reading_status': 'Completed', 'progress_percent': 100})
    assert status == 200, f"Status update failed: {body}"
    print(f"[10/11] Reading status updated: Completed (100%)")

    # 11. Remove Book from Library
    status, body = req('/library/1/10', method='DELETE')
    assert status == 200, f"Remove book failed: {body}"
    print(f"[11/11] Book removed from library cleanly")

    print("\n" + "=" * 65)
    print(" ALL 11 WORKFLOW STEPS VERIFIED & FULLY FUNCTIONAL!")
    print("=" * 65)

if __name__ == '__main__':
    run_tests()
