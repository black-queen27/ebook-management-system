-- ====================================================================
-- E-Book Management System Database Schema & Initial Seed Data
-- Database Name: ebook_management_system
-- ====================================================================

CREATE DATABASE IF NOT EXISTS ebook_management_system;
USE ebook_management_system;

-- 1. Users Table
DROP TABLE IF EXISTS user_library;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30) DEFAULT '+91 98765 43210',
    education VARCHAR(150) DEFAULT 'B.Tech Information Technology',
    college VARCHAR(150) DEFAULT 'Loyola ICAM College',
    course VARCHAR(150) DEFAULT 'B.Tech Information Technology',
    year_of_study VARCHAR(50) DEFAULT '2nd Year',
    department VARCHAR(100) DEFAULT 'Information Technology',
    date_of_birth VARCHAR(50) DEFAULT '14 August 2006',
    reading_preferences TEXT,
    avatar_url VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    role VARCHAR(50) DEFAULT 'Student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Books Table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    about_text TEXT,
    cover_image VARCHAR(255),
    cover_color VARCHAR(50) DEFAULT '#2563EB',
    published_year INT DEFAULT 2020,
    pages INT DEFAULT 300,
    language VARCHAR(50) DEFAULT 'English',
    file_format VARCHAR(50) DEFAULT 'PDF / EPUB',
    availability VARCHAR(50) DEFAULT 'Available now',
    file_size VARCHAR(50) DEFAULT '8.4 MB',
    est_reading_time VARCHAR(50) DEFAULT '4h 52m',
    student_reads VARCHAR(50) DEFAULT '12,480',
    rating DECIMAL(2,1) DEFAULT 4.8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Library Table (junction table for user tracking)
CREATE TABLE user_library (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reading_status VARCHAR(50) DEFAULT 'Currently Reading', -- 'Currently Reading', 'Completed', 'Want to Read'
    progress_percent INT DEFAULT 0,
    rating INT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY user_book_unique (user_id, book_id)
);

-- ====================================================================
-- Initial Seed Data
-- ====================================================================

-- Insert Default Demo User: Sharini (matches Figma UI exactly)
-- Password is 'password123' hashed with scrypt/werkzeug (and fallback support)
INSERT INTO users (id, name, email, password, phone, education, college, course, year_of_study, department, date_of_birth, reading_preferences, role)
VALUES (
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
),
(
    2,
    'Administrator',
    'admin@ebook.edu',
    'scrypt:32768:8:1$2bQh6q0O0xLgKz8d$4f676ff3bc073fa8ffbeebf899ce69623e83955681c2e403d151cb8fe899a6cbf26c2e35a1dae7bf93f54d6faebad41a4a49fe031665a95393a5518b5b48154e',
    '+91 98765 00000',
    'M.L.I.Sc Library Science',
    'Central University Library',
    'Library Administration',
    'Chief Librarian',
    'Library Administration',
    '01 January 1990',
    'Technology,Science,Business,Self Development,Fiction',
    'Admin'
);

-- Insert Books (12 high-quality books matching Figma screens)
INSERT INTO books (id, title, author, category, description, about_text, cover_color, published_year, pages, language, file_format, availability, file_size, est_reading_time, student_reads, rating)
VALUES
(
    1,
    'Atomic Habits',
    'James Clear',
    'Self Development',
    'An easy and proven framework for building good habits and breaking bad ones. James Clear reveals practical strategies that make small improvements compound into remarkable results.',
    'Atomic Habits explains how tiny changes in behavior can transform your life. Through clear examples and research-backed techniques, the book shows how to design better systems, overcome a lack of motivation, and create an environment where good habits happen naturally.',
    '#ea580c',
    2018,
    320,
    'English',
    'PDF / EPUB',
    'Available now',
    '8.4 MB',
    '4h 52m',
    '12,480',
    4.8
),
(
    2,
    'The Alchemist',
    'Paulo Coelho',
    'Fiction',
    'A fable about following your dream. A magical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.',
    'The Alchemist has enchanted millions of readers worldwide. This timeless classic tells the story of Santiago, who embarks on an extraordinary journey across the Egyptian desert to find a buried treasure near the Pyramids.',
    '#0f766e',
    1988,
    208,
    'English',
    'PDF / EPUB',
    'Available now',
    '5.2 MB',
    '3h 15m',
    '18,920',
    4.7
),
(
    3,
    'Clean Code',
    'Robert C. Martin',
    'Technology',
    'A handbook of agile software craftsmanship. Learn the principles, patterns, and practices of writing clean, maintainable, and elegant code.',
    'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. This book presents revolutionary best practices to write pristine code.',
    '#334155',
    2008,
    464,
    'English',
    'PDF / EPUB',
    'Available now',
    '12.1 MB',
    '7h 40m',
    '9,350',
    4.6
),
(
    4,
    'The Psychology of Money',
    'Morgan Housel',
    'Business',
    'Timeless lessons on wealth, greed, and happiness. Doing well with money isn\'t necessarily about what you know. It\'s about how you behave.',
    'Money—investing, personal finance, and business decisions—is typically taught as a math-based field. But in the real world people don\'t make financial decisions on a spreadsheet. They make them at the dinner table or in a meeting room, where personal history and unique view of the world collide.',
    '#15803d',
    2020,
    256,
    'English',
    'PDF / EPUB',
    'Available now',
    '6.7 MB',
    '3h 50m',
    '15,200',
    4.7
),
(
    5,
    'Deep Work',
    'Cal Newport',
    'Self Development',
    'Rules for focused success in a distracted world. Deep work is the ability to focus without distraction on a cognitively demanding task.',
    'Deep work will make you better at what you do and provide the sense of true fulfillment that comes from craftsmanship. In short, deep work is like a super power in our increasingly competitive twenty-first century economy.',
    '#1d4ed8',
    2016,
    304,
    'English',
    'PDF / EPUB',
    'Available now',
    '7.8 MB',
    '4h 30m',
    '11,400',
    4.6
),
(
    6,
    'Python Crash Course',
    'Eric Matthes',
    'Technology',
    'A hands-on, project-based introduction to programming. Write clean code, solve problems, and build functional real-world applications in Python.',
    'Python Crash Course is the world\'s best-selling guide to the Python programming language. This fast-paced, thorough introduction will have you writing programs, solving problems, and developing working web applications in no time.',
    '#7c3aed',
    2019,
    544,
    'English',
    'PDF / EPUB',
    'Available now',
    '14.5 MB',
    '8h 50m',
    '14,800',
    4.8
),
(
    7,
    'Rich Dad Poor Dad',
    'Robert Kiyosaki',
    'Business',
    'What the rich teach their kids about money that the poor and middle class do not! Explodes the myth that you need to earn a high income to become rich.',
    'Rich Dad Poor Dad is Robert\'s story of growing up with two dads—his real father and the father of his best friend, his rich dad—and the ways in which both men shaped his thoughts about money and investing.',
    '#b91c1c',
    1997,
    336,
    'English',
    'PDF / EPUB',
    'Available now',
    '6.9 MB',
    '5h 10m',
    '22,100',
    4.5
),
(
    8,
    'The Power of Habit',
    'Charles Duhigg',
    'Self Development',
    'Why we do what we do in life and business. At its core, The Power of Habit contains an exhilarating argument: The key to exercising regularly, losing weight, and being more productive is understanding how habits work.',
    'In The Power of Habit, award-winning business reporter Charles Duhigg takes us to the thrilling edge of scientific discoveries that explain why habits exist and how they can be changed. Transforming our habits can transform our lives.',
    '#0e7490',
    2012,
    416,
    'English',
    'PDF / EPUB',
    'Available now',
    '9.2 MB',
    '6h 15m',
    '10,950',
    4.6
),
(
    9,
    'Think and Grow Rich',
    'Napoleon Hill',
    'Self Development',
    'The landmark bestseller on achieving success and financial independence through mindset, faith, persistence, and specialized knowledge.',
    'Think and Grow Rich has been called the Granddaddy of All Motivational Literature. It was the first book to boldly ask: What makes a winner? The man who asked and listened for the answer, Napoleon Hill, is now counted in the top ranks of the world\'s winners himself.',
    '#78350f',
    1937,
    238,
    'English',
    'PDF / EPUB',
    'Available now',
    '4.8 MB',
    '3h 45m',
    '16,400',
    4.6
),
(
    10,
    'A Brief History of Time',
    'Stephen Hawking',
    'Science',
    'From the Big Bang to Black Holes. Stephen Hawking’s worldwide bestseller explores the profound questions about our universe and existence.',
    'Was there a beginning of time? Could time run backwards? Is the universe infinite or does it have boundaries? These are just some of the questions considered in an internationally acclaimed masterpiece by one of the greatest minds of our time.',
    '#312e81',
    1988,
    212,
    'English',
    'PDF / EPUB',
    'Available now',
    '5.6 MB',
    '3h 30m',
    '13,100',
    4.7
),
(
    11,
    'Steve Jobs',
    'Walter Isaacson',
    'Biography',
    'The exclusive biography of Steve Jobs, based on more than forty interviews with Jobs conducted over two years, as well as interviews with family, friends, and competitors.',
    'Driven by demons, Jobs could drive those around him to fury and despair. But his personality and products were interrelated, just as Apple\'s hardware and software tended to be, as if part of an integrated system.',
    '#374151',
    2011,
    656,
    'English',
    'PDF / EPUB',
    'Available now',
    '15.8 MB',
    '10h 20m',
    '8,700',
    4.8
),
(
    12,
    'Sapiens: A Brief History of Humankind',
    'Yuval Noah Harari',
    'History',
    'From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution that explores the ways in which biology and history have defined us.',
    'One hundred thousand years ago, at least six different species of humans inhabited Earth. Yet today there is only one—Homo sapiens. What happened to the others? And what may happen to us?',
    '#c2410c',
    2014,
    498,
    'English',
    'PDF / EPUB',
    'Available now',
    '11.3 MB',
    '7h 50m',
    '17,650',
    4.8
);

-- Seed User's Initial Library Collection (Matches Dashboard & Profile UI exactly)
-- Sharini (user_id = 1)
INSERT INTO user_library (user_id, book_id, reading_status, progress_percent, rating)
VALUES
(1, 1, 'Currently Reading', 68, 5), -- Atomic Habits: 68%
(1, 2, 'Currently Reading', 42, 5), -- The Alchemist: 42%
(1, 3, 'Currently Reading', 24, 4), -- Clean Code: 24%
(1, 4, 'Completed', 100, 5),         -- The Psychology of Money
(1, 5, 'Completed', 100, 5),         -- Deep Work
(1, 6, 'Want to Read', 0, NULL),     -- Python Crash Course
(1, 7, 'Completed', 100, 4),         -- Rich Dad Poor Dad
(1, 8, 'Completed', 100, 5);         -- The Power of Habit
