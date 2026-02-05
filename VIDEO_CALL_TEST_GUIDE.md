# Video Call Testing Guide

## Setup

### 1. Install Dependencies
```bash
cd campus-mentor
npm install
```

### 2. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

## Testing Scenarios

### Scenario 1: Demo Mode (No Server)
**Purpose:** Test UI and camera/mic access without signaling server

1. Open `http://localhost:3000/pages/video-call.html` directly (without running server.js)
2. Allow camera/mic access when prompted
3. You should see:
   - Your local video in the left pane
   - Demo canvas in the right pane (if no peer)
   - Notification: "Running in demo mode (no signaling server)"
4. Test controls:
   - Click video/audio toggle buttons
   - Try screen share button

### Scenario 2: Real Peer-to-Peer Call (With Server)
**Purpose:** Test actual WebRTC connection between two peers

#### Step 1: Start Server
```bash
npm start
```

#### Step 2: Open First Tab (Peer A)
1. Navigate to: `http://localhost:3000/pages/video-call.html?room=test123`
2. Allow camera/mic access
3. Click "Start Call" button
4. You should see:
   - Notification: "Connected to server"
   - Notification: "Joined room: test123"
   - Your local video in left pane

#### Step 3: Open Second Tab (Peer B)
1. Open a new tab/window
2. Navigate to: `http://localhost:3000/pages/video-call.html?room=test123` (same room!)
3. Allow camera/mic access
4. Click "Start Call" button
5. You should see:
   - Both tabs show "Peer joined the room"
   - Peer A sees Peer B's video in right pane
   - Peer B sees Peer A's video in right pane
   - Notification: "Remote video connected!"

#### Step 4: Test Features
- **Toggle Video:** Click video button to disable/enable camera
- **Toggle Audio:** Click mic button to mute/unmute
- **Screen Share:** Click share button to share your screen
- **End Call:** Click red phone button to end

### Scenario 3: Multiple Rooms
**Purpose:** Test room isolation

1. Open Tab 1: `http://localhost:3000/pages/video-call.html?room=math101`
2. Open Tab 2: `http://localhost:3000/pages/video-call.html?room=physics202`
3. Open Tab 3: `http://localhost:3000/pages/video-call.html?room=math101`

Expected:
- Tab 1 and Tab 3 connect (same room)
- Tab 2 is isolated (different room)

## Troubleshooting

### Issue: "Camera/microphone access denied"
**Solution:** 
- Click the camera icon in browser address bar
- Allow camera and microphone permissions
- Refresh the page

### Issue: "Running in demo mode"
**Solution:**
- Make sure `npm start` is running
- Check console for Socket.IO connection errors
- Verify you're accessing via `http://localhost:3000` (not file://)

### Issue: "Peer doesn't connect"
**Solution:**
- Ensure both tabs use the same `?room=XXXXX` parameter
- Check browser console for WebRTC errors
- Try refreshing both tabs
- Make sure both peers clicked "Start Call"

### Issue: "No video showing"
**Solution:**
- Check if camera is being used by another app
- Try different browser (Chrome/Edge recommended)
- Check browser console for errors
- Verify video elements exist: `document.getElementById('localVideo')`

## Browser Console Logs

### Expected Logs (Successful Connection)
```
Connected to signaling server: <socket-id>
User connected: user_abc123
Received offer from: user_abc123
Remote track received: MediaStream
Connection state: connected
```

### Network Tab
- Look for Socket.IO connection: `ws://localhost:3000/socket.io/`
- Should show "101 Switching Protocols" (WebSocket upgrade)

## Room URL Format

- **Random room:** `http://localhost:3000/pages/video-call.html`
  - System generates unique room ID
  - Share the URL with peer to join same room

- **Specific room:** `http://localhost:3000/pages/video-call.html?room=YOUR_ROOM_NAME`
  - Use same room name for all participants
  - Example: `?room=math-tutoring-session-1`

## Production Deployment Notes

For production deployment:

1. **HTTPS Required:** WebRTC requires HTTPS in production (getUserMedia won't work on HTTP except localhost)

2. **TURN Server:** For users behind strict NATs/firewalls, add TURN server:
   ```javascript
   iceServers: [
       { urls: 'stun:stun.l.google.com:19302' },
       { 
           urls: 'turn:your-turn-server.com:3478',
           username: 'user',
           credential: 'pass'
       }
   ]
   ```

3. **Server URL:** Update Socket.IO connection if server is on different domain:
   ```javascript
   this.socket = io('https://your-server.com');
   ```

## Quick Test Command

```bash
# Terminal 1: Start server
npm start

# Terminal 2: Open browser tabs
start http://localhost:3000/pages/video-call.html?room=test
start http://localhost:3000/pages/video-call.html?room=test
```

## Success Criteria

✅ Local video shows in left pane
✅ Remote video shows in right pane when peer joins
✅ Audio/video toggle buttons work
✅ Screen sharing works
✅ Connection survives for 30+ seconds
✅ Call ends cleanly without errors
✅ Multiple rooms work independently
