# 🗄️ SQLite Database Integration - Campus Mentor

## Overview
This document explains the SQLite database integration for the Campus Mentor App. The integration provides a lightweight, file-based database solution perfect for hackathon demonstrations and local development.

## 📁 Files Created

```
campus-mentor/
├── db/
│   └── database.js              # Database initialization and connection
├── models/
│   └── SQLiteUser.js            # User model with CRUD operations
├── sqlite-demo.js               # Standalone demo application
├── campus_mentor.db             # SQLite database file (auto-created)
└── SQLITE_INTEGRATION.md        # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

This will install the `sqlite3` package along with other dependencies.

### 2. Run the Demo
Test the SQLite functionality with the standalone demo:

```bash
node sqlite-demo.js
```

This will:
- ✅ Create the database file (`campus_mentor.db`)
- ✅ Create the `users` table
- ✅ Add sample users (students, teachers, admin)
- ✅ Demonstrate all CRUD operations
- ✅ Show search and statistics features

### 3. Run the Full Server
Start the Campus Mentor server with SQLite integration:

```bash
node server.js
```

The server will:
- Initialize the SQLite database automatically
- Start on port 3001 (or your configured PORT)
- Provide REST API endpoints for user management

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id`: Auto-incrementing primary key
- `name`: User's full name (required)
- `email`: User's email address (required, unique)
- `role`: User role - must be 'student', 'teacher', or 'admin'
- `created_at`: Timestamp of user creation

## 🔌 API Endpoints

All SQLite endpoints are prefixed with `/api/sqlite/`

### 1. Add User
**POST** `/api/sqlite/users`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "created_at": "2025-10-13 14:22:24"
  }
}
```

### 2. Get All Users
**GET** `/api/sqlite/users`

**Response:**
```json
{
  "success": true,
  "users": [...],
  "count": 5
}
```

### 3. Get User by ID
**GET** `/api/sqlite/users/:id`

**Example:** `/api/sqlite/users/1`

### 4. Get Users by Role
**GET** `/api/sqlite/users/role/:role`

**Example:** `/api/sqlite/users/role/teacher`

### 5. Update User
**PUT** `/api/sqlite/users/:id`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

### 6. Delete User
**DELETE** `/api/sqlite/users/:id`

### 7. Search Users
**GET** `/api/sqlite/users/search/:term`

**Example:** `/api/sqlite/users/search/john`

### 8. Get Statistics
**GET** `/api/sqlite/stats`

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 10,
    "student": 6,
    "teacher": 3,
    "admin": 1
  }
}
```

## 💻 Using in Your Code

### Import the Model
```javascript
const SQLiteUser = require('./models/SQLiteUser');
```

### Add a User
```javascript
const user = await SQLiteUser.addUser('John Doe', 'john@example.com', 'student');
console.log('Created user:', user);
```

### Get All Users
```javascript
const users = await SQLiteUser.getUsers();
console.log('All users:', users);
```

### Get User by ID
```javascript
const user = await SQLiteUser.getUserById(1);
console.log('User:', user);
```

### Get Users by Role
```javascript
const teachers = await SQLiteUser.getUsersByRole('teacher');
console.log('Teachers:', teachers);
```

### Update User
```javascript
const updated = await SQLiteUser.updateUser(1, {
  name: 'Jane Doe',
  email: 'jane@example.com'
});
```

### Delete User
```javascript
await SQLiteUser.deleteUser(1);
console.log('User deleted');
```

### Search Users
```javascript
const results = await SQLiteUser.searchUsers('john');
console.log('Search results:', results);
```

### Get Statistics
```javascript
const stats = await SQLiteUser.getUserStats();
console.log('Stats:', stats);
```

## 🧪 Testing with cURL

### Add a User
```bash
curl -X POST http://localhost:3001/api/sqlite/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","role":"student"}'
```

### Get All Users
```bash
curl http://localhost:3001/api/sqlite/users
```

### Get User by ID
```bash
curl http://localhost:3001/api/sqlite/users/1
```

### Update User
```bash
curl -X PUT http://localhost:3001/api/sqlite/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:3001/api/sqlite/users/1
```

### Search Users
```bash
curl http://localhost:3001/api/sqlite/users/search/john
```

### Get Statistics
```bash
curl http://localhost:3001/api/sqlite/stats
```

## 🎯 Hackathon Demo Tips

### 1. Live Demo Flow
```bash
# Terminal 1: Start the server
node server.js

# Terminal 2: Run the demo
node sqlite-demo.js

# Terminal 3: Test API endpoints
curl http://localhost:3001/api/sqlite/users
```

### 2. Show Database File
```bash
# The database file is created at:
campus-mentor/campus_mentor.db

# You can open it with SQLite browser or command line:
sqlite3 campus_mentor.db
.tables
SELECT * FROM users;
```

### 3. Key Features to Highlight
- ✅ **Automatic Setup**: Database and tables created automatically
- ✅ **No Configuration**: Works out of the box, no setup required
- ✅ **Persistent Storage**: Data survives server restarts
- ✅ **Fast Performance**: SQLite is incredibly fast for local operations
- ✅ **RESTful API**: Clean, well-documented API endpoints
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **Data Validation**: Role validation, unique email constraints

### 4. Demo Script
```javascript
// Show in your presentation:

// 1. Add users
await SQLiteUser.addUser('Alice', 'alice@example.com', 'student');
await SQLiteUser.addUser('Bob', 'bob@example.com', 'teacher');

// 2. Get all users
const users = await SQLiteUser.getUsers();
console.table(users);

// 3. Search functionality
const results = await SQLiteUser.searchUsers('alice');

// 4. Statistics
const stats = await SQLiteUser.getUserStats();
console.log(`Total users: ${stats.total}`);
console.log(`Students: ${stats.student}`);
console.log(`Teachers: ${stats.teacher}`);
```

## 🔧 Troubleshooting

### Database File Not Created
- Ensure you have write permissions in the project directory
- Check that `sqlite3` is properly installed: `npm list sqlite3`

### "UNIQUE constraint failed" Error
- This means you're trying to add a user with an email that already exists
- Use a different email or update the existing user

### Module Not Found
- Run `npm install` to ensure all dependencies are installed
- Check that you're in the correct directory

### Port Already in Use
- Change the PORT in your `.env` file or environment variables
- Default port is 3001

## 📚 Additional Resources

### SQLite Documentation
- [SQLite Official Docs](https://www.sqlite.org/docs.html)
- [node-sqlite3 GitHub](https://github.com/TryGhost/node-sqlite3)

### Database Viewers
- [DB Browser for SQLite](https://sqlitebrowser.org/) - GUI tool
- Command line: `sqlite3 campus_mentor.db`

## 🎓 Educational Value

This integration demonstrates:
- **Database Design**: Proper schema with constraints
- **CRUD Operations**: Complete Create, Read, Update, Delete
- **Async/Await**: Modern JavaScript async patterns
- **Error Handling**: Comprehensive error management
- **REST API**: RESTful endpoint design
- **Code Organization**: Separation of concerns (models, routes, database)

## 🚀 Next Steps

### Extend the Database
Add more tables for your app:
```javascript
// In db/database.js, add:
function createCoursesTable(db) {
    const sql = `
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            teacher_id INTEGER,
            description TEXT,
            FOREIGN KEY (teacher_id) REFERENCES users(id)
        )
    `;
    return new Promise((resolve, reject) => {
        db.run(sql, (err) => {
            err ? reject(err) : resolve();
        });
    });
}
```

### Add Relationships
Create models for courses, assignments, etc., and link them to users.

### Add Authentication
Implement password hashing and JWT tokens for secure authentication.

---

**Made with ❤️ for Campus Mentor Hackathon**

For questions or issues, check the main README or contact the development team.
