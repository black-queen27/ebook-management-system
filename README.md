# E-Book Management System 📚

A beginner-friendly, full-stack web application designed for a **College Software Engineering Mini Project**, faithfully recreating the Figma UI design for a university campus e-book library.

---

## 🌟 Key Features

1. **Exact Figma UI Reproduction**:
   - **Login Page**: Split-screen design with interactive 3D-styled tablet graphic, bookmark accents, "READ. LEARN. GROW." card, and authentication form.
   - **Dashboard Page**: Personalized greeting (`Good Morning, Sharini!`), 4 key metric cards (`Total Books`, `My Books`, `Currently Reading`, `Completed`), `Continue Reading` progress tracker cards, and `Recently Added` showcase.
   - **Library Catalog Page**: Dynamic book grid with color-coded covers, category pills (`Fiction`, `Technology`, `Business`, `Self Development`, `Science`), live search, sorting, and quick bookmarking.
   - **Book Details Page**: Detailed book hero with metadata cards (Published Year, Pages, Language, Format, Availability, File Size), synopsis, reading stats, interactive e-book reader modal, and related book recommendations.
   - **Profile Page**: Personal details, academic info (College, Course, Year, Department), reading preferences tags selector, and live database persistence.
   - **My Library Page**: Dedicated reading tracker with status tabs (`Currently Reading`, `Completed`, `Want to Read`), progress sliders, and collection management.

2. **Technology Stack**:
   - **Frontend**: React 18, Vite, JavaScript, CSS3 with modern design tokens & Lucide icons.
   - **Backend**: Python 3.10+, Flask, REST API, PyMySQL, Werkzeug (Password Hashing).
   - **Database**: MySQL 8.0 (Database name: `ebook_management_system`) with automated resilient fallback for instant offline testing.

---

## 📁 Project Structure

```
ebook-management-system/
│
├── frontend/                       # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx         # Docked navigation sidebar matching Figma
│   │   │   ├── Header.jsx          # Top search bar, notifications, user avatar
│   │   │   ├── BookCover.jsx       # Elegant book cover component with colors & bookmarks
│   │   │   └── ReaderModal.jsx     # In-browser reader with progress slider & completion
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Screenshot 1: Login & Register
│   │   │   ├── Dashboard.jsx       # Screenshot 3: Metrics, Continue Reading, Recent
│   │   │   ├── LibraryCatalog.jsx  # Screenshot 5: Catalog, Categories, Search, Filters
│   │   │   ├── BookDetails.jsx     # Screenshot 4: Hero, Attributes, About, Related
│   │   │   ├── Profile.jsx         # Screenshot 2: Personal & Academic Profile, Preferences
│   │   │   ├── MyLibrary.jsx       # Personal collection & reading progress tracker
│   │   │   └── Settings.jsx        # System status & database engine monitor
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # User session state management
│   │   ├── services/
│   │   │   └── api.js              # Centralized Fetch API client
│   │   ├── App.jsx                 # Routing configuration
│   │   ├── main.jsx                # Entry point
│   │   └── styles.css              # Master stylesheet matching Figma screens
│   ├── package.json
│   └── vite.config.js
│
├── backend/                        # Flask REST API Backend
│   ├── routes/
│   │   ├── auth.py                 # Registration & Login endpoints
│   │   ├── books.py                # Catalog, search, filters & details
│   │   ├── library.py              # User library, progress & dashboard metrics
│   │   └── users.py                # Profile fetch & update
│   ├── app.py                      # Flask main server
│   ├── database.py                 # MySQL database connection & parameterized queries
│   ├── init_db.py                  # Standalone MySQL database setup script
│   ├── test_workflow_urllib.py     # Automated 11-step end-to-end verification
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Example environment configuration
│   └── .env                        # Active environment credentials
│
├── database/
│   └── ebook_management_system.sql # MySQL database DDL schema and initial seed data
│
└── README.md                       # Setup and demonstration instructions
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **MySQL Server** (Optional: MySQL 8.0 or MySQL Workbench / XAMPP)

---

### Step 1: Database Setup (MySQL)

#### Option A: Using MySQL Command Line or Workbench
1. Open MySQL Workbench or command line:
   ```bash
   mysql -u root -p
   ```
2. Run the SQL initialization script:
   ```sql
   source C:/Users/anbus/.gemini/antigravity/scratch/ebook-management-system/database/ebook_management_system.sql;
   ```
   *(Or open `database/ebook_management_system.sql` in MySQL Workbench and click Execute)*

3. Configure your MySQL credentials in `backend/.env`:
   ```ini
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=ebook_management_system
   ```

4. Verify database setup:
   ```bash
   cd backend
   python init_db.py
   ```

> **Note**: If MySQL server is not installed or configured on the machine, the system will automatically run in local mode with identical seed data so the project demonstrates seamlessly without any crashes.

---

### Step 2: Start the Backend (Flask)

1. Open a terminal in `backend/`:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Mac / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask API server:
   ```bash
   python app.py
   ```
   Backend runs at: `http://127.0.0.1:5000`

---

### Step 3: Start the Frontend (React + Vite)

1. Open a second terminal in `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://127.0.0.1:3000
   ```

---

## 🔑 Demo Account Credentials

Use the default credentials (or click the **"Demo: Login as Sharini"** button on the Login page):

- **Email**: `sharini@student.edu`
- **Password**: `password123`

You can also click **"Sign Up"** to create a brand new student account!

---

## 🧪 Testing the Workflow

Run the included automated end-to-end verification script from the `backend/` folder:

```bash
cd backend
python test_workflow_urllib.py
```

This verifies all 11 core functional steps:
1. `GET /api/health` - Database connection and server health
2. `POST /api/register` - Creating a new student account
3. `POST /api/login` - Authenticating user and validating password hash
4. `POST /api/login` - Logging in as default demo user Sharini
5. `GET /api/dashboard/1` - Loading metrics and reading progress
6. `PUT /api/users/1` - Updating personal and academic profile details
7. `GET /api/books?q=Atomic` - Live database search
8. `GET /api/books/1` - Book details with related books
9. `POST /api/library` - Adding book to personal reading list
10. `PUT /api/library/1/10/status` - Updating reading progress percentage
11. `DELETE /api/library/1/10` - Removing book from library

---

## 🎓 Viva / Mini Project Presentation Highlights

When demonstrating this project:
1. **Figma Fidelity**: Point out how the login illustration, dashboard metric cards, catalog book covers, details hero card, and profile cards visually match the Figma prototypes.
2. **Architecture**: Explain the separation of concerns:
   - **React Components**: Stateful, responsive UI consuming JSON APIs.
   - **Flask REST Endpoints**: Blueprints for Auth, Books, Library, and Users.
   - **Parameterized SQL**: Protection against SQL Injection using `%s` placeholders.
   - **Password Security**: Werkzeug password hashing (scrypt / pbkdf2).
3. **Dynamic Features**:
   - Live book search & category filtering.
   - Real-time reading progress slider with database persistence.
   - Interactive e-book reader modal with excerpt viewer.
   - Editable student profile with instant updates.
