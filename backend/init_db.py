"""
Standalone database initialization script for MySQL.
Usage:
    python init_db.py
"""

import sys
from database import test_mysql_connection, init_mysql_database, DB_HOST, DB_USER, DB_NAME

def main():
    print("=" * 60)
    print(" E-Book Management System - Database Initializer")
    print("=" * 60)
    print(f"Target: MySQL Server at {DB_HOST}, User: {DB_USER}, DB: {DB_NAME}")

    success, msg = test_mysql_connection()
    if not success:
        print(f"\n[ERROR] Could not connect to MySQL server: {msg}")
        print("\nTroubleshooting Steps:")
        print("1. Ensure MySQL service is running (e.g. MySQL80 in Services).")
        print("2. Open 'backend/.env' and update DB_PASSWORD with your MySQL root password.")
        print("3. Alternatively import 'database/ebook_management_system.sql' in MySQL Workbench.")
        sys.exit(1)

    print("\n[OK] MySQL Server reachable! Creating database and loading schema...")
    try:
        init_mysql_database()
        print("[SUCCESS] MySQL database 'ebook_management_system' is fully initialized and seeded!")
    except Exception as e:
        print(f"[ERROR] Failed to initialize schema: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
