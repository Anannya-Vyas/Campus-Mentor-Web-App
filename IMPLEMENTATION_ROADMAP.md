# Campus Mentor - Implementation Roadmap

## ✅ COMPLETED

### 1. Spidro AI Chatbot - FIXED ✅
- **Status:** Intelligent responses now working
- **Features:**
  - Emotional support (stress, sadness, anxiety)
  - Study techniques and exam prep
  - Motivation and procrastination help
  - Time management advice
  - Career guidance
  - Detailed, empathetic responses
- **Test:** Go to Spidro AI page, ask "I'm feeling stressed" or "How do I study better?"

### 2. Background Music - WORKING ✅
- **Status:** Added to all pages
- **Location:** Bottom-right floating player
- **Test:** Click play button on any page

### 3. Video Call System - PARTIALLY WORKING ⚠️
- **Status:** WebRTC + Socket.IO implemented
- **Issue:** Need server running (`npm start`)
- **Fix:** Ensure both users are in same room (`?room=test123`)
- **Test:** Open two tabs with same room parameter

---

## 🚧 IN PROGRESS

### 4. Marketplace (Notes & Books)
**Current:** Basic UI, not functional
**Needed:**
- Upload system for notes/books
- Price in Indian Rupees (₹)
- Categories (Subject-wise)
- Search and filter
- Download/purchase system
- User's own uploads section

**Files to create:**
- `pages/marketplace-upload.html`
- `scripts/marketplace.js`
- Backend API for file uploads

### 5. To-Do List
**Current:** Not working
**Needed:**
- Add/edit/delete tasks
- Mark as complete
- Due dates
- Priority levels
- LocalStorage persistence

**Files to create:**
- `pages/todo.html`
- `scripts/todo.js`

### 6. Diet Planner
**Current:** Not working
**Needed:**
- Age/weight/height input
- BMI calculation
- Personalized meal plans
- Indian food options
- Calorie tracking
- Water intake reminder

**Files to create:**
- `pages/diet-planner.html` (update existing)
- `scripts/diet-planner.js`

### 7. Mind Games
**Current:** Not working
**Needed:**
- Memory card game
- Sudoku
- Word puzzle
- Math quiz
- Play against AI/bot
- Score tracking

**Files to create:**
- `pages/games.html` (update existing)
- `scripts/memory-game.js`
- `scripts/sudoku.js`

### 8. Smart Alarm
**Current:** Not working
**Needed:**
- Set multiple alarms
- Custom alarm sound
- Snooze function
- Repeat options (daily, weekly)
- Browser notifications
- Actual sound playback

**Files to create:**
- `pages/alarm.html`
- `scripts/alarm.js`
- `assets/sounds/alarm.mp3`

---

## 📋 PENDING (High Priority)

### 9. Teacher Profile System
**Needed:**
- Complete profile page
- Education details
- Subjects taught
- Experience (years)
- Rating system (1-5 stars)
- Reviews from students
- Hourly rate
- Availability calendar
- Profile photo

**Files to create:**
- `pages/teacher-profile.html`
- `pages/teacher-profile-edit.html`
- `scripts/teacher-profile.js`

### 10. Real-Time Chat (WhatsApp-like)
**Needed:**
- One-on-one messaging
- Message history
- Read receipts
- Typing indicators
- File sharing
- Emoji support
- Notification system

**Files to create:**
- `pages/chat.html`
- `scripts/chat.js`
- Socket.IO integration (already have server)

### 11. Teacher Dashboard Improvements
**Needed:**
- List of connected students
- Upcoming sessions
- Earnings tracker
- Student requests
- Schedule management
- Analytics (hours taught, ratings)

**Files to update:**
- `pages/teacher-dashboard.html`
- `scripts/teacher-dashboard.js`

### 12. Student-Teacher Connection System
**Needed:**
- Send connection request
- Accept/reject requests
- Active connections list
- Schedule sessions
- Payment integration
- Session history

**Files to create:**
- `pages/connections.html`
- `scripts/connections.js`
- Database/localStorage for relationships

---

## 🎯 QUICK FIXES NEEDED

### Video Call Issues:
1. **Can't see teacher:**
   - Both users must click "Start Call"
   - Both must be in same room (`?room=SAME_NAME`)
   - Server must be running (`npm start`)
   - Allow camera/mic permissions

2. **Screen share not working:**
   - Already implemented
   - Click "Share Screen" button
   - Select window/screen to share

3. **Recording not working:**
   - Need to implement MediaRecorder API
   - Add download recorded video feature

---

## 📊 PRIORITY ORDER

### Phase 1 (Critical - Do First):
1. ✅ Fix Spidro AI (DONE)
2. Fix video call connection issues
3. Build marketplace with upload
4. Create teacher profile system
5. Implement real-time chat

### Phase 2 (Important):
6. To-Do List
7. Smart Alarm
8. Mind Games
9. Diet Planner

### Phase 3 (Enhancement):
10. Teacher dashboard improvements
11. Student-teacher connection system
12. Payment integration
13. Analytics and reports

---

## 🛠️ TECHNICAL REQUIREMENTS

### For Marketplace (File Upload):
- Need backend API (Node.js/Express)
- File storage (local or cloud)
- Database for metadata
- Payment gateway (Razorpay for India)

### For Real-Time Chat:
- Socket.IO (already have server)
- Message database/localStorage
- File upload for attachments
- Push notifications API

### For Video Call Recording:
- MediaRecorder API
- Blob storage
- Download functionality

### For Alarms:
- Web Audio API
- Browser Notification API
- Service Worker (for background)

---

## 📝 NEXT STEPS

### Immediate Actions:
1. Test Spidro AI - should now give detailed responses
2. Fix video call by ensuring server is running
3. Decide which feature to build next
4. Get API keys if needed (Gemini AI, payment gateway)

### For You to Provide:
- **Gemini API Key** (for real AI): https://makersuite.google.com/app/apikey
- **Payment Gateway** preference (Razorpay, Stripe, PayPal)
- **Priority** - Which feature do you want built first?

---

## 🚀 HOW TO TEST CURRENT FIXES

### Test Spidro AI:
```
1. npm start
2. Open: http://localhost:3001/pages/community.html
3. Type: "I'm feeling stressed about exams"
4. Should get detailed, helpful response
```

### Test Video Call:
```
1. npm start
2. Tab 1: http://localhost:3001/pages/video-call.html?room=test123
3. Tab 2: http://localhost:3001/pages/video-call.html?room=test123
4. Click "Start Call" in BOTH tabs
5. Allow camera/mic in BOTH tabs
6. Should see each other's video
```

### Test Background Music:
```
1. Open any page
2. Look bottom-right corner
3. Click play button
4. Music should play
```

---

## 💡 RECOMMENDATIONS

1. **Start with most critical features** (marketplace, teacher profiles, chat)
2. **Use existing technologies** (Socket.IO for chat, localStorage for data)
3. **Build incrementally** - one feature at a time
4. **Test thoroughly** before moving to next feature
5. **Consider using Firebase** for backend (easier than building custom API)

---

Let me know which feature you want me to build next!
