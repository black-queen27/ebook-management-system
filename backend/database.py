"""
Database connection and utility module for E-Book Management System.
Supports MySQL connection with parameterized queries and beginner-friendly error handling.
"""

import os
import sqlite3
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = int(os.getenv('DB_PORT', 3306))
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'ebook_management_system')

# Track active database mode
ACTIVE_DB_MODE = 'MYSQL'
SQLITE_DB_PATH = Path(__file__).resolve().parent / 'ebook_management_system.db'

def get_mysql_connection(use_database=True):
    """Attempt to establish a MySQL connection using PyMySQL."""
    import pymysql
    import pymysql.cursors

    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME if use_database else None,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

def test_mysql_connection():
    """Test if MySQL server is reachable with configured credentials."""
    try:
        import pymysql
        conn = get_mysql_connection(use_database=False)
        conn.close()
        return True, "MySQL Connected Successfully"
    except Exception as e:
        return False, str(e)

def init_mysql_database():
    """Initialize MySQL database schema and seed data from SQL script."""
    import pymysql
    # Connect without specifying database to create it
    conn = get_mysql_connection(use_database=False)
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    conn.close()

    # Now connect to the database and check tables
    conn = get_mysql_connection(use_database=True)
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES LIKE 'books';")
    books_table = cursor.fetchone()

    cursor.execute("SHOW TABLES LIKE 'users';")
    users_table = cursor.fetchone()

    if not books_table or not users_table:
        sql_file = Path(__file__).resolve().parent.parent / 'database' / 'ebook_management_system.sql'
        if sql_file.exists():
            print(f"[DB] Initializing MySQL from {sql_file.name}...")
            with open(sql_file, 'r', encoding='utf-8') as f:
                sql_content = f.read()
            commands = sql_content.split(';')
            for cmd in commands:
                cmd_clean = cmd.strip()
                if cmd_clean and not cmd_clean.startswith('--'):
                    try:
                        cursor.execute(cmd_clean)
                    except Exception:
                        pass
            print("[DB] MySQL database schema initialized and seeded successfully.")
    conn.close()

def init_sqlite_database():
    """Initialize SQLite database as an immediate fallback using parameterized inserts."""
    conn = sqlite3.connect(SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='books';")
    if not cursor.fetchone():
        print(f"[DB] Initializing SQLite fallback at {SQLITE_DB_PATH}...")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            phone TEXT DEFAULT '+91 98765 43210',
            education TEXT DEFAULT 'B.Tech Information Technology',
            college TEXT DEFAULT 'Loyola ICAM College',
            course TEXT DEFAULT 'B.Tech Information Technology',
            year_of_study TEXT DEFAULT '2nd Year',
            department TEXT DEFAULT 'Information Technology',
            date_of_birth TEXT DEFAULT '14 August 2006',
            reading_preferences TEXT,
            avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
            role TEXT DEFAULT 'Student',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            about_text TEXT,
            cover_image TEXT,
            cover_color TEXT DEFAULT '#2563EB',
            published_year INTEGER DEFAULT 2020,
            pages INTEGER DEFAULT 300,
            language TEXT DEFAULT 'English',
            file_format TEXT DEFAULT 'PDF / EPUB',
            availability TEXT DEFAULT 'Available now',
            file_size TEXT DEFAULT '8.4 MB',
            est_reading_time TEXT DEFAULT '4h 52m',
            student_reads TEXT DEFAULT '12,480',
            rating REAL DEFAULT 4.8,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_library (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            reading_status TEXT DEFAULT 'Currently Reading',
            progress_percent INTEGER DEFAULT 0,
            rating INTEGER DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            UNIQUE(user_id, book_id)
        );
        """)

        # Insert Sharini demo user
        cursor.execute("""
        INSERT OR IGNORE INTO users (id, name, email, password, phone, education, college, course, year_of_study, department, date_of_birth, reading_preferences, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            1,
            'Sharini',
            'sharini@student.edu',
            'scrypt:32768:8:1$2bQh6q0O0xLgKz8d$4f676ff3bc073fa8ffbeebf899ce69623e83955681c2e403d151cb8fe899a6cbf26c2e35a1dae7bf93f54d6faebad41a4a49fe031665a95393a5518b5b48154e',
            '+91 98765 43210',
            'B.Tech Information Technology',
            'Loyola ICAM College',
            'B.Tech Information Technology',
            '2nd Year',
            'Information Technology',
            '14 August 2006',
            'Fiction,Technology,Self Development,Science,Business',
            'Student'
        ))

        # Sample books list
        books_data = [
            (1, 'Atomic Habits', 'James Clear', 'Self Development',
             'An easy and proven framework for building good habits and breaking bad ones. James Clear reveals practical strategies that make small improvements compound into remarkable results.',
             'Atomic Habits explains how tiny changes in behavior can transform your life. Through clear examples and research-backed techniques, the book shows how to design better systems, overcome a lack of motivation, and create an environment where good habits happen naturally.',
             '#ea580c', 2018, 320, 'English', 'PDF / EPUB', 'Available now', '8.4 MB', '4h 52m', '12,480', 4.8),
            (2, 'The Alchemist', 'Paulo Coelho', 'Fiction',
             'A fable about following your dream. A magical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.',
             'The Alchemist has enchanted millions of readers worldwide. This timeless classic tells the story of Santiago, who embarks on an extraordinary journey across the Egyptian desert to find a buried treasure near the Pyramids.',
             '#0f766e', 1988, 208, 'English', 'PDF / EPUB', 'Available now', '5.2 MB', '3h 15m', '18,920', 4.7),
            (3, 'Clean Code', 'Robert C. Martin', 'Technology',
             'A handbook of agile software craftsmanship. Learn the principles, patterns, and practices of writing clean, maintainable, and elegant code.',
             'Even bad code can function. But if code is not clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. This book presents revolutionary best practices to write pristine code.',
             '#334155', 2008, 464, 'English', 'PDF / EPUB', 'Available now', '12.1 MB', '7h 40m', '9,350', 4.6),
            (4, 'The Psychology of Money', 'Morgan Housel', 'Business',
             'Timeless lessons on wealth, greed, and happiness. Doing well with money is not necessarily about what you know. It is about how you behave.',
             'Money—investing, personal finance, and business decisions—is typically taught as a math-based field. But in the real world people make decisions at the dinner table where personal history collides.',
             '#15803d', 2020, 256, 'English', 'PDF / EPUB', 'Available now', '6.7 MB', '3h 50m', '15,200', 4.7),
            (5, 'Deep Work', 'Cal Newport', 'Self Development',
             'Rules for focused success in a distracted world. Deep work is the ability to focus without distraction on a cognitively demanding task.',
             'Deep work will make you better at what you do and provide the sense of true fulfillment that comes from craftsmanship. A super power in our increasingly competitive economy.',
             '#1d4ed8', 2016, 304, 'English', 'PDF / EPUB', 'Available now', '7.8 MB', '4h 30m', '11,400', 4.6),
            (6, 'Python Crash Course', 'Eric Matthes', 'Technology',
             'A hands-on, project-based introduction to programming. Write clean code, solve problems, and build functional real-world applications in Python.',
             'Python Crash Course is the world bestselling guide to Python. This fast-paced, thorough introduction will have you writing programs and solving problems in no time.',
             '#7c3aed', 2019, 544, 'English', 'PDF / EPUB', 'Available now', '14.5 MB', '8h 50m', '14,800', 4.8),
            (7, 'Rich Dad Poor Dad', 'Robert Kiyosaki', 'Business',
             'What the rich teach their kids about money that the poor and middle class do not! Explodes the myth that you need to earn a high income to become rich.',
             'Rich Dad Poor Dad is Robert story of growing up with two dads and the ways in which both men shaped his thoughts about money and investing.',
             '#b91c1c', 1997, 336, 'English', 'PDF / EPUB', 'Available now', '6.9 MB', '5h 10m', '22,100', 4.5),
            (8, 'The Power of Habit', 'Charles Duhigg', 'Self Development',
             'Why we do what we do in life and business. At its core, The Power of Habit contains an exhilarating argument: The key to exercising regularly, losing weight, and being more productive is understanding how habits work.',
             'Award-winning business reporter Charles Duhigg takes us to the thrilling edge of scientific discoveries that explain why habits exist and how they can be changed.',
             '#0e7490', 2012, 416, 'English', 'PDF / EPUB', 'Available now', '9.2 MB', '6h 15m', '10,950', 4.6),
            (9, 'Think and Grow Rich', 'Napoleon Hill', 'Self Development',
             'The landmark bestseller on achieving success and financial independence through mindset, faith, persistence, and specialized knowledge.',
             'The first book to boldly ask: What makes a winner? Napoleon Hill reveals the secrets to personal and financial triumph.',
             '#78350f', 1937, 238, 'English', 'PDF / EPUB', 'Available now', '4.8 MB', '3h 45m', '16,400', 4.6),
            (10, 'A Brief History of Time', 'Stephen Hawking', 'Science',
             'From the Big Bang to Black Holes. Stephen Hawking worldwide bestseller explores the profound questions about our universe and existence.',
             'Was there a beginning of time? Could time run backwards? Is the universe infinite or does it have boundaries?',
             '#312e81', 1988, 212, 'English', 'PDF / EPUB', 'Available now', '5.6 MB', '3h 30m', '13,100', 4.7),
            (11, 'Steve Jobs', 'Walter Isaacson', 'Biography',
             'The exclusive biography of Steve Jobs, based on more than forty interviews with Jobs conducted over two years.',
             'Driven by demons, Jobs could drive those around him to fury and despair. An inspiring journey of technology, invention and design.',
             '#374151', 2011, 656, 'English', 'PDF / EPUB', 'Available now', '15.8 MB', '10h 20m', '8,700', 4.8),
            (12, 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'History',
             'From a renowned historian comes a groundbreaking narrative of humanity creation and evolution that explores how biology and history have defined us.',
             'One hundred thousand years ago, at least six different species of humans inhabited Earth. Today only Homo sapiens remains.',
             '#c2410c', 2014, 498, 'English', 'PDF / EPUB', 'Available now', '11.3 MB', '7h 50m', '17,650', 4.8)
        ]

        cursor.executemany("""
        INSERT OR IGNORE INTO books (id, title, author, category, description, about_text, cover_color, published_year, pages, language, file_format, availability, file_size, est_reading_time, student_reads, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, books_data)

        # Seed user library records
        user_library_data = [
            (1, 1, 1, 'Currently Reading', 68, 5),
            (2, 1, 2, 'Currently Reading', 42, 5),
            (3, 1, 3, 'Currently Reading', 24, 4),
            (4, 1, 4, 'Completed', 100, 5),
            (5, 1, 5, 'Completed', 100, 5),
            (6, 1, 6, 'Want to Read', 0, None),
            (7, 1, 7, 'Completed', 100, 4),
            (8, 1, 8, 'Completed', 100, 5)
        ]

        cursor.executemany("""
        INSERT OR IGNORE INTO user_library (id, user_id, book_id, reading_status, progress_percent, rating)
        VALUES (?, ?, ?, ?, ?, ?)
        """, user_library_data)

        conn.commit()
    conn.close()

def init_database():
    """Determine database backend and initialize tables."""
    global ACTIVE_DB_MODE
    is_ok, msg = test_mysql_connection()
    if is_ok:
        try:
            init_mysql_database()
            ACTIVE_DB_MODE = 'MYSQL'
            print("[DB INFO] Successfully connected to MySQL server (ebook_management_system).")
            return
        except Exception as e:
            print(f"[DB WARNING] MySQL init encountered error: {e}. Falling back to SQLite.")
    else:
        print(f"[DB NOTICE] MySQL not ready ({msg}). Using SQLite fallback for demo/testing.")
        print(f"[DB NOTICE] To use MySQL: Set DB_PASSWORD in backend/.env and run: python init_db.py")

    ACTIVE_DB_MODE = 'SQLITE'
    init_sqlite_database()

_IS_INITIALIZED = False

def get_connection():
    """Return database connection based on active mode."""
    global _IS_INITIALIZED
    if not _IS_INITIALIZED:
        init_database()
        _IS_INITIALIZED = True

    if ACTIVE_DB_MODE == 'MYSQL':
        return get_mysql_connection(use_database=True)
    else:
        conn = sqlite3.connect(SQLITE_DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

def query_db(query, args=(), one=False):
    """Execute a SELECT query and return rows as dictionary list or single dict."""
    conn = get_connection()
    try:
        if ACTIVE_DB_MODE == 'MYSQL':
            with conn.cursor() as cursor:
                cursor.execute(query, args)
                rows = cursor.fetchall()
                return (rows[0] if rows else None) if one else rows
        else:
            sqlite_query = query.replace('%s', '?')
            cursor = conn.cursor()
            cursor.execute(sqlite_query, args)
            rows = [dict(row) for row in cursor.fetchall()]
            return (rows[0] if rows else None) if one else rows
    finally:
        conn.close()

def modify_db(query, args=()):
    """Execute an INSERT, UPDATE, or DELETE query. Returns lastrowid and rowcount."""
    conn = get_connection()
    try:
        if ACTIVE_DB_MODE == 'MYSQL':
            with conn.cursor() as cursor:
                cursor.execute(query, args)
                last_id = cursor.lastrowid
                rowcount = cursor.rowcount
            conn.commit()
            return {'lastrowid': last_id, 'rowcount': rowcount}
        else:
            sqlite_query = query.replace('%s', '?')
            cursor = conn.cursor()
            cursor.execute(sqlite_query, args)
            last_id = cursor.lastrowid
            rowcount = cursor.rowcount
            conn.commit()
            return {'lastrowid': last_id, 'rowcount': rowcount}
    finally:
        conn.close()

def get_db_status():
    """Return current active database information."""
    return {
        'mode': ACTIVE_DB_MODE,
        'database_name': DB_NAME,
        'host': DB_HOST if ACTIVE_DB_MODE == 'MYSQL' else 'Local SQLite File',
        'is_mysql': ACTIVE_DB_MODE == 'MYSQL'
    }
