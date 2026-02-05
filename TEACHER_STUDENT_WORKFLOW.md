# Teacher-Student Interaction System - Complete Workflow

## Overview
This system implements a comprehensive teacher-student interaction workflow with real-time chat, payment verification, teacher approval, and conditional video call access.

## System Components

### 1. Connection Manager (`scripts/connection-manager.js`)
- Manages all teacher-student connections
- Stores data in localStorage
- Tracks connection status, payment status, and messages
- Provides methods for approval/rejection

### 2. Pages Created/Modified

#### Student Side:
- **find-teachers.html** - Browse and search for teachers
- **teacher-profile-view.html** - View detailed teacher profiles
- **teacher-chat.html** - Real-time chat with teachers (with payment upload)
- **video-call.html** - Video calling (only accessible after approval)

#### Teacher Side:
- **teacher-dashboard.html** - Shows pending student requests count
- **student-requests.html** - Manage student requests (approve/reject)

## Complete Workflow

### Step 1: Student Finds Teacher
1. Student logs into their dashboard
2. Clicks "Find Teachers"
3. Browses available teachers
4. Can view teacher profile or start chat

### Step 2: Initial Chat (10 Free Messages)
1. Student clicks "Chat" button
2. System creates a connection with status: `pending`
3. Student gets 10 free messages to negotiate
4. Each message sent decreases free message count
5. Teacher can respond to messages

### Step 3: Payment Upload
1. When free messages are exhausted, student must upload payment proof
2. Student uploads screenshot of payment (Paytm, GPay, etc.)
3. Payment status changes to: `pending_verification`
4. Chat is disabled until teacher approves

### Step 4: Teacher Reviews Request
1. Teacher sees notification in dashboard (Pending Requests count)
2. Teacher clicks on "Pending Requests"
3. Teacher can see:
   - Student details
   - Chat history
   - Payment screenshot
4. Teacher has two options:
   - **Approve** - Grants full access
   - **Reject** - Denies access

### Step 5: Approval & Video Call Access
**If Approved:**
- Connection status changes to: `approved`
- Payment status changes to: `verified`
- Student gets:
  - Unlimited messaging
  - Video call button appears in chat
  - Can make video calls with teacher

**If Rejected:**
- Connection status changes to: `rejected`
- Student cannot send more messages
- No video call access

### Step 6: Video Calling
1. Video call button only visible when:
   - Status = `approved`
   - Payment = `verified`
2. Student clicks video call button
3. System checks permissions before allowing call
4. If not approved, shows error message

## Data Structure

### Connection Object
```javascript
{
    id: "conn_timestamp_random",
    studentId: "student@email.com",
    studentName: "Student Name",
    teacherId: "teacher@email.com",
    teacherName: "Teacher Name",
    teacherSubject: "Subject",
    status: "pending|approved|rejected",
    paymentStatus: "unpaid|pending_verification|verified",
    paymentScreenshot: "base64_image_data",
    initiatedAt: "ISO_timestamp",
    approvedAt: "ISO_timestamp",
    messages: [
        {
            id: "msg_id",
            text: "message text",
            sender: "email",
            timestamp: "ISO_timestamp",
            read: false
        }
    ],
    freeMessagesRemaining: 10
}
```

## Key Features

### 1. Free Message System
- Students get 10 free messages initially
- Counter decreases with each student message
- Teacher messages don't count
- When exhausted, payment required

### 2. Payment Verification
- Student uploads payment screenshot
- Image stored as base64 in localStorage
- Teacher can view and verify
- Automatic verification on approval

### 3. Access Control
- Video calls blocked until approval
- Chat blocked after free messages (until payment)
- Rejected students cannot interact

### 4. Real-time Updates
- Messages refresh every 2 seconds
- Connection status updates immediately
- UI updates based on current state

## Security Considerations

### Current Implementation (Demo):
- Uses localStorage (client-side only)
- No actual server backend
- Data persists in browser

### Production Recommendations:
1. Implement backend API (Node.js/Express)
2. Use database (MongoDB/PostgreSQL)
3. Add authentication tokens (JWT)
4. Encrypt payment data
5. Implement real-time with Socket.IO
6. Add file size limits for uploads
7. Validate payment screenshots
8. Add rate limiting
9. Implement proper video call signaling server

## Testing the Workflow

### Test Scenario 1: Complete Success Flow
1. Login as student
2. Find a teacher
3. Start chat (use 10 messages)
4. Upload payment screenshot
5. Login as teacher (use teacher email from find-teachers.html)
6. Go to student requests
7. Approve the student
8. Login back as student
9. See video call button
10. Make video call

### Test Scenario 2: Rejection Flow
1. Follow steps 1-4 above
2. Login as teacher
3. Reject the student
4. Login back as student
5. See rejection message
6. Cannot send messages or make calls

### Test Scenario 3: No Payment Flow
1. Login as student
2. Start chat
3. Try to make video call directly
4. Should be blocked with error message

## Teacher Accounts for Testing

From `find-teachers.html`, these teacher emails can be used:
- sarah.johnson@campus.com (Mathematics)
- rajesh.kumar@campus.com (Physics)
- priya.sharma@campus.com (Chemistry)
- amit.patel@campus.com (Computer Science)
- neha.gupta@campus.com (Biology)
- vikram.singh@campus.com (English Literature)

## Files Modified/Created

### New Files:
1. `scripts/connection-manager.js` - Core connection management
2. `pages/teacher-profile-view.html` - Teacher profile viewer
3. `pages/teacher-chat.html` - Student-teacher chat interface
4. `pages/student-requests.html` - Teacher request management

### Modified Files:
1. `pages/find-teachers.html` - Added profile view and chat initiation
2. `pages/teacher-dashboard.html` - Added pending requests counter
3. `pages/video-call.html` - Added approval checking

## Future Enhancements

1. **Notifications System**
   - Push notifications for new messages
   - Email notifications for approvals/rejections

2. **Payment Integration**
   - Integrate real payment gateways
   - Automatic payment verification

3. **Advanced Chat Features**
   - File sharing
   - Voice messages
   - Message reactions
   - Read receipts

4. **Video Call Enhancements**
   - Recording sessions
   - Whiteboard feature
   - Session scheduling
   - Automatic session summaries

5. **Analytics**
   - Student progress tracking
   - Teacher performance metrics
   - Session analytics

6. **Mobile App**
   - React Native/Flutter app
   - Push notifications
   - Offline support

## Support

For issues or questions about this system:
1. Check the console for error messages
2. Verify localStorage data: `localStorage.getItem('teacherStudentConnections')`
3. Clear localStorage to reset: `localStorage.clear()`
4. Ensure you're using a modern browser with localStorage support

## License
Part of Campus Mentor Platform
