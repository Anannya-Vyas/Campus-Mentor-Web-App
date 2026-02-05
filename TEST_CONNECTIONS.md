# Testing Teacher-Student Connections

## How to Test the Messages Feature

### Step 1: Create Test Data (Use Browser Console)

Open the browser console (F12) and run this code to create test connections:

```javascript
// Create a test teacher user
const testTeacher = {
    email: 'teacher@test.com',
    name: 'Test Teacher',
    type: 'teacher'
};
localStorage.setItem('currentUser', JSON.stringify(testTeacher));

// Create test student connections
const connectionManager = new ConnectionManager();

// Add approved student 1
const student1 = {
    id: 'conn_' + Date.now() + '_1',
    studentId: 'student1@test.com',
    studentName: 'Alice Johnson',
    teacherId: 'teacher@test.com',
    teacherName: 'Test Teacher',
    teacherSubject: 'Mathematics',
    status: 'approved',
    paymentStatus: 'verified',
    initiatedAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
    messages: [
        {
            id: 'msg_1',
            text: 'Hello teacher! Can we schedule a session?',
            sender: 'student1@test.com',
            timestamp: new Date().toISOString(),
            read: false
        }
    ],
    freeMessagesRemaining: 10
};

// Add approved student 2
const student2 = {
    id: 'conn_' + Date.now() + '_2',
    studentId: 'student2@test.com',
    studentName: 'Bob Smith',
    teacherId: 'teacher@test.com',
    teacherName: 'Test Teacher',
    teacherSubject: 'Physics',
    status: 'approved',
    paymentStatus: 'verified',
    initiatedAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
    messages: [],
    freeMessagesRemaining: 10
};

// Add pending student
const student3 = {
    id: 'conn_' + Date.now() + '_3',
    studentId: 'student3@test.com',
    studentName: 'Charlie Brown',
    teacherId: 'teacher@test.com',
    teacherName: 'Test Teacher',
    teacherSubject: 'Chemistry',
    status: 'pending',
    paymentStatus: 'unpaid',
    initiatedAt: new Date().toISOString(),
    messages: [],
    freeMessagesRemaining: 10
};

// Save connections
const connections = [student1, student2, student3];
localStorage.setItem('teacherStudentConnections', JSON.stringify(connections));

console.log('✅ Test data created!');
console.log('Approved students: 2 (Alice Johnson, Bob Smith)');
console.log('Pending students: 1 (Charlie Brown)');
console.log('Refresh the page to see them!');
```

### Step 2: Verify in Teacher Messages

1. Go to `teacher-messages.html`
2. You should see 2 approved students in the sidebar:
   - Alice Johnson (with 1 unread message)
   - Bob Smith (no messages)
3. Click on a student to open the chat

### Step 3: Test the Flow

**Normal Flow:**
1. Student requests connection → Status: `pending`
2. Teacher approves → Status: `approved`
3. Student appears in teacher messages
4. Teacher can chat with student
5. Teacher can video call student

### Step 4: Check Console for Debug Info

Open browser console (F12) on the messages page to see:
- Total connections count
- Approved students count
- Full connection data

### Quick Commands for Testing

**Check current connections:**
```javascript
const cm = new ConnectionManager();
console.log('My connections:', cm.getMyConnections());
console.log('Approved:', cm.getMyConnections().filter(c => c.status === 'approved'));
```

**Clear all connections:**
```javascript
localStorage.removeItem('teacherStudentConnections');
console.log('✅ All connections cleared');
```

**Check current user:**
```javascript
console.log('Current user:', JSON.parse(localStorage.getItem('currentUser')));
```

## Troubleshooting

### Issue: "No students yet" message appears

**Possible causes:**
1. No connections exist in localStorage
2. No approved students (all are pending/rejected)
3. Wrong user type (not logged in as teacher)
4. Teacher email doesn't match connection teacherId

**Solution:**
1. Check console logs for debug info
2. Verify you're logged in as a teacher
3. Go to Student Requests page and approve a student
4. Or use the test data script above

### Issue: Students don't appear after approval

**Solution:**
1. Refresh the messages page
2. Check browser console for errors
3. Verify connection status changed to 'approved'
4. Check localStorage: `localStorage.getItem('teacherStudentConnections')`
