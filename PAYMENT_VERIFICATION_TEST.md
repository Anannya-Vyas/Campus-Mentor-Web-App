# 🧪 Payment Verification Testing Guide

## ⚠️ IMPORTANT: Clear Old Data First!

Before testing, **clear old test data** that might have auto-verified payments:

### **Option 1: Clear in Browser Console**
```javascript
// Press F12 to open console, then run:
localStorage.removeItem('teacherStudentConnections');
location.reload();
```

### **Option 2: Clear All Campus Mentor Data**
```javascript
// Press F12 to open console, then run:
Object.keys(localStorage).forEach(key => {
    if (key.includes('teacher') || key.includes('student') || key.includes('connection')) {
        localStorage.removeItem(key);
    }
});
location.reload();
```

---

## ✅ Complete Test Flow

### **Step 1: Student Sends Chat Request**
```
1. Login as STUDENT
2. Go to "Find Teachers"
3. Click on a teacher
4. Click "Chat"
5. ✅ Connection created with status: "pending"
6. ✅ Payment status: "unpaid"
```

### **Step 2: Teacher Approves Student**
```
1. Login as TEACHER (different browser/tab)
2. Go to "Pending Requests"
3. See student request
4. Click "Approve Student"
5. ✅ Student status: "approved"
6. ✅ Payment status: STILL "unpaid" (not auto-verified!)
```

### **Step 3: Student Sends Messages (Free)**
```
1. Back to STUDENT
2. Send 9 messages (free messages)
3. ✅ Can send messages
4. ✅ Counter decreases: 9, 8, 7... 0
5. ✅ After 9 messages: "Upload payment proof"
```

### **Step 4: Student Uploads Payment**
```
1. Click "Upload Screenshot"
2. Select payment image
3. ✅ Image uploads
4. ✅ Payment status: "pending_verification"
5. ✅ Message shows: "💳 Payment proof uploaded"
```

### **Step 5: Teacher Views Payment**
```
1. Back to TEACHER
2. Go to "Pending Requests" or "Approved" tab
3. See student card
4. ✅ Payment Status: "⏳ Pending Verification" (Yellow)
5. ✅ Payment Proof section visible
6. ✅ Can see payment screenshot
7. ✅ Two buttons: "Verify Payment" and "Reject Payment"
```

### **Step 6: Teacher Verifies Payment**
```
1. Click payment image to view full size
2. Verify it's a valid payment
3. Click "Verify Payment"
4. Confirm dialog
5. ✅ Payment status: "✓ Verified" (Green)
6. ✅ Shows "Payment Verified" badge
7. ✅ Buttons disappear
```

### **Step 7: Student Gets Unlimited Access**
```
1. Back to STUDENT
2. Refresh page
3. ✅ Can send unlimited messages
4. ✅ No payment prompt
5. ✅ Chat works normally
```

---

## 🔍 What to Check

### **Payment Status Should Be:**

| Stage | Status | Color | Teacher Sees |
|-------|--------|-------|--------------|
| Initial | ✗ Not Paid | Red | No payment proof |
| After Upload | ⏳ Pending Verification | Yellow | Payment proof + Verify/Reject buttons |
| After Verify | ✓ Verified | Green | Payment proof + "Verified" badge |
| After Reject | ✗ Not Paid | Red | No payment proof |

---

## ❌ Common Issues & Fixes

### **Issue 1: Payment Auto-Verified**
**Problem:** Payment shows "Verified" immediately after student approval

**Fix:**
```
1. Clear localStorage (see top of guide)
2. Test again from Step 1
3. Should now require manual verification
```

### **Issue 2: Payment Screenshot Not Showing**
**Problem:** "undefined" or no image in teacher view

**Fix:**
```
1. Make sure student uploaded IMAGE file (not PDF)
2. Check browser console for errors (F12)
3. Verify file size < 10MB
4. Try uploading again
```

### **Issue 3: Verify Button Not Working**
**Problem:** Click "Verify Payment" but nothing happens

**Fix:**
```
1. Check browser console for errors
2. Make sure connection-manager.js is loaded
3. Refresh page and try again
```

---

## 🎯 Expected Behavior

### **✅ CORRECT:**
```
1. Student approved → Payment STILL "unpaid"
2. Student uploads payment → Status "pending_verification"
3. Teacher clicks "Verify" → Status "verified"
4. Student gets unlimited messaging
```

### **❌ INCORRECT (Old Behavior):**
```
1. Student approved → Payment AUTO "verified" ❌
2. No manual verification needed ❌
3. Teacher has no control ❌
```

---

## 🧹 Reset Test Environment

### **Complete Reset:**
```javascript
// In browser console (F12):
localStorage.clear();
location.reload();

// Then:
1. Re-register test users
2. Start testing from Step 1
```

### **Partial Reset (Keep Users):**
```javascript
// In browser console (F12):
localStorage.removeItem('teacherStudentConnections');
location.reload();

// Then:
1. Users still exist
2. Start testing from Step 1
```

---

## ✅ Success Criteria

**Test is successful if:**

1. ✅ Student approval does NOT auto-verify payment
2. ✅ Payment status stays "unpaid" after approval
3. ✅ Payment screenshot visible to teacher
4. ✅ Verify/Reject buttons appear for pending payments
5. ✅ Teacher can manually verify payment
6. ✅ Student gets unlimited access after verification
7. ✅ No "undefined" in messages

---

## 📝 Test Checklist

- [ ] Cleared old test data
- [ ] Student sends chat request
- [ ] Teacher approves student
- [ ] Payment status STILL "unpaid" ✅
- [ ] Student sends 9 free messages
- [ ] Student uploads payment screenshot
- [ ] Payment status "pending_verification" ✅
- [ ] Teacher sees payment screenshot ✅
- [ ] Teacher sees Verify/Reject buttons ✅
- [ ] Teacher clicks "Verify Payment"
- [ ] Payment status "verified" ✅
- [ ] Student has unlimited messaging ✅

---

## 🎉 All Tests Pass?

**Congratulations!** Payment verification is working correctly:
- ✅ Manual verification only
- ✅ Teacher has full control
- ✅ Payment screenshots visible
- ✅ No auto-verification
- ✅ Proper status flow

**Ready for production!** 🚀
