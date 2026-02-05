# 🔥 Firebase Setup Guide - Campus Mentor

## Overview
This guide will help you set up Firebase backend for your Campus Mentor app, enabling real persistent data across all devices.

---

## 📋 What You'll Get

After setup:
- ✅ **Real user authentication** (no more localStorage)
- ✅ **Persistent data** across all devices
- ✅ **Real-time messaging** updates
- ✅ **Cloud database** (Firestore)
- ✅ **Secure** user data
- ✅ **FREE** for small apps (up to 50k reads/day)

---

## 🚀 Step-by-Step Setup

### Step 1: Create Firebase Project

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com
   - Click **"Add project"** or **"Create a project"**

2. **Enter Project Details:**
   ```
   Project name: campus-mentor
   ```
   - Click **Continue**

3. **Google Analytics (Optional):**
   - You can disable this for now
   - Click **Continue**

4. **Create Project:**
   - Wait for project to be created (30 seconds)
   - Click **Continue**

---

### Step 2: Register Your Web App

1. **In Firebase Console:**
   - Click the **Web icon** (</>) to add a web app
   - Or go to Project Settings → Your apps → Add app

2. **Register App:**
   ```
   App nickname: Campus Mentor Web
   ```
   - ✅ Check **"Also set up Firebase Hosting"** (optional)
   - Click **Register app**

3. **Copy Firebase Config:**
   - You'll see a code snippet like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "campus-mentor-xxxxx.firebaseapp.com",
     projectId: "campus-mentor-xxxxx",
     storageBucket: "campus-mentor-xxxxx.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:xxxxxxxxxxxxx"
   };
   ```
   - **COPY THIS!** You'll need it in Step 4

---

### Step 3: Enable Authentication

1. **In Firebase Console:**
   - Click **Authentication** in left sidebar
   - Click **Get started**

2. **Enable Email/Password:**
   - Click **Sign-in method** tab
   - Click **Email/Password**
   - Toggle **Enable**
   - Click **Save**

---

### Step 4: Enable Firestore Database

1. **In Firebase Console:**
   - Click **Firestore Database** in left sidebar
   - Click **Create database**

2. **Choose Mode:**
   - Select **Start in test mode** (for development)
   - Click **Next**

3. **Choose Location:**
   - Select closest location (e.g., `asia-south1` for India)
   - Click **Enable**
   - Wait for database to be created

4. **Update Security Rules (Important!):**
   - Go to **Rules** tab
   - Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Connections collection
    match /connections/{connectionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
      
      // Messages subcollection
      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
    }
  }
}
```

   - Click **Publish**

---

### Step 5: Update Firebase Config in Your App

1. **Open file:** `scripts/firebase-config.js`

2. **Replace the config** with YOUR values from Step 2:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",              // ← Replace this
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // ← Replace this
    projectId: "YOUR_PROJECT_ID",             // ← Replace this
    storageBucket: "YOUR_PROJECT_ID.appspot.com",   // ← Replace this
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // ← Replace this
    appId: "YOUR_APP_ID"                      // ← Replace this
};
```

3. **Save the file**

---

### Step 6: Test Firebase Connection

1. **Open your app** in browser (locally first)

2. **Open Browser Console** (F12)

3. **You should see:**
   ```
   ✅ Firebase initialized successfully
   ```

4. **If you see errors:**
   - Check if Firebase config is correct
   - Check internet connection
   - Check browser console for specific errors

---

## 🔧 Migrating Existing Data (Optional)

If you have existing data in localStorage, you can migrate it to Firebase:

### Migration Script:

Add this to browser console on your LOCAL version:

```javascript
async function migrateToFirebase() {
    const firebaseService = window.firebaseService;
    
    // 1. Migrate Users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log(`Migrating ${users.length} users...`);
    
    for (const user of users) {
        try {
            await firebaseService.createUser(user);
            console.log(`✅ Migrated user: ${user.email}`);
        } catch (error) {
            console.log(`⚠️ User ${user.email} might already exist`);
        }
    }
    
    // 2. Migrate Connections
    const connections = JSON.parse(localStorage.getItem('teacherStudentConnections') || '[]');
    console.log(`Migrating ${connections.length} connections...`);
    
    for (const conn of connections) {
        try {
            const result = await firebaseService.createConnection(conn);
            console.log(`✅ Migrated connection: ${result.id}`);
            
            // Migrate messages for this connection
            if (conn.messages && conn.messages.length > 0) {
                for (const msg of conn.messages) {
                    await firebaseService.sendMessage(result.id, msg);
                }
                console.log(`  ✅ Migrated ${conn.messages.length} messages`);
            }
        } catch (error) {
            console.error(`❌ Error migrating connection:`, error);
        }
    }
    
    console.log('🎉 Migration complete!');
}

// Run migration
migrateToFirebase();
```

---

## 📝 Database Structure

Your Firebase Firestore will have this structure:

```
campus-mentor (project)
├── users (collection)
│   ├── {userId} (document)
│   │   ├── uid: string
│   │   ├── name: string
│   │   ├── email: string
│   │   ├── type: "teacher" | "student"
│   │   ├── subject: string (for teachers)
│   │   ├── phone: string
│   │   ├── bio: string
│   │   └── createdAt: timestamp
│   │
│   └── {userId2} (document)
│       └── ...
│
└── connections (collection)
    ├── {connectionId} (document)
    │   ├── studentId: string (email)
    │   ├── studentName: string
    │   ├── teacherId: string (email)
    │   ├── teacherName: string
    │   ├── teacherSubject: string
    │   ├── status: "pending" | "approved" | "rejected"
    │   ├── paymentStatus: "unpaid" | "pending_verification" | "verified"
    │   ├── paymentScreenshot: string (base64)
    │   ├── freeMessagesRemaining: number
    │   ├── createdAt: timestamp
    │   │
    │   └── messages (subcollection)
    │       ├── {messageId} (document)
    │       │   ├── text: string
    │       │   ├── sender: string (email)
    │       │   ├── read: boolean
    │       │   ├── timestamp: timestamp
    │       │   └── image: string (optional)
    │       │
    │       └── {messageId2} (document)
    │           └── ...
    │
    └── {connectionId2} (document)
        └── ...
```

---

## 🧪 Testing Firebase Integration

### Test 1: User Signup
1. Go to signup page
2. Create new account
3. Check Firebase Console → Authentication
4. ✅ User should appear in Users list
5. Check Firestore → users collection
6. ✅ User document should exist

### Test 2: User Login
1. Login with created account
2. ✅ Should redirect to dashboard
3. ✅ User data should load from Firebase

### Test 3: Create Connection
1. Student requests teacher
2. Check Firestore → connections collection
3. ✅ New connection document should appear

### Test 4: Send Message
1. Send message in chat
2. Check Firestore → connections → {id} → messages
3. ✅ Message document should appear
4. ✅ Real-time update should work

---

## 🔐 Security Rules Explained

```javascript
// Users can read all users (to find teachers)
// But can only update their own profile
match /users/{userId} {
  allow read: if true;  // Anyone can read
  allow write: if request.auth.uid == userId;  // Only owner can write
}

// Connections require authentication
// Any authenticated user can create/read/update
match /connections/{connectionId} {
  allow read, write: if request.auth != null;
}
```

**For Production:** Make rules more strict:
- Students can only see their own connections
- Teachers can only see their connections
- Only connection participants can send messages

---

## 💰 Firebase Free Tier Limits

### Firestore:
- ✅ **50,000 reads/day**
- ✅ **20,000 writes/day**
- ✅ **20,000 deletes/day**
- ✅ **1 GB storage**
- ✅ **10 GB/month network egress**

### Authentication:
- ✅ **Unlimited** users
- ✅ **Unlimited** sign-ins

### This is MORE than enough for:
- 100-500 active users
- Thousands of messages per day
- Your entire campus!

---

## 🚀 Deploying with Firebase

After setup, you can also deploy your app to Firebase Hosting:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

Your app will be live at:
```
https://campus-mentor-xxxxx.web.app
```

---

## 🔄 How It Works Now

### Before (localStorage):
```
Browser 1: User A data → localStorage (Browser 1 only)
Browser 2: User B data → localStorage (Browser 2 only)
❌ No data sharing
❌ No real-time updates
```

### After (Firebase):
```
Browser 1: User A → Firebase Cloud ← User B :Browser 2
✅ Shared data
✅ Real-time updates
✅ Works on all devices
```

---

## 📱 Benefits

1. **Cross-Device Sync:**
   - Login on phone → See same data
   - Login on laptop → See same data

2. **Real-Time Updates:**
   - Teacher sends message → Student sees instantly
   - Student uploads payment → Teacher sees instantly

3. **Persistent Data:**
   - Clear browser cache → Data still there
   - Reinstall browser → Data still there

4. **Scalable:**
   - Can handle thousands of users
   - Automatic backups
   - No server management

---

## 🐛 Troubleshooting

### Error: "Firebase not defined"
**Solution:** Check if Firebase SDK scripts are loaded in HTML

### Error: "Permission denied"
**Solution:** Check Firestore security rules

### Error: "Invalid API key"
**Solution:** Double-check firebase-config.js values

### Error: "Network request failed"
**Solution:** Check internet connection

### Users not appearing in Firestore
**Solution:** 
1. Check if authentication worked
2. Check browser console for errors
3. Verify firebaseService is initialized

---

## ✅ Checklist

Before going live:
- [ ] Firebase project created
- [ ] Web app registered
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Security rules updated
- [ ] Firebase config added to app
- [ ] Tested signup/login
- [ ] Tested creating connections
- [ ] Tested sending messages
- [ ] Deployed to hosting

---

## 📞 Support

If you encounter issues:
1. Check Firebase Console for errors
2. Check browser console (F12)
3. Review Firebase documentation: https://firebase.google.com/docs
4. Check Firestore rules
5. Verify internet connection

---

## 🎉 You're Done!

Once setup is complete:
1. **Deploy your app** (Netlify/Vercel/Firebase Hosting)
2. **Share the URL** with users
3. **Everyone will see the same data!**
4. **Real-time updates work!**
5. **No more localStorage issues!**

---

**Created by: Cascade AI Assistant**
**Date: October 14, 2025**
**Status: Ready for Firebase Integration** 🔥
