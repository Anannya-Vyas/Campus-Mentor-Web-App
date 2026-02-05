// Campus Mentor Server - Enhanced with Firebase Integration and SQLite
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const FirebaseService = require('./services/FirebaseService');
const { setupDatabase } = require('./db/database');
const SQLiteUser = require('./models/SQLiteUser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Initialize Services
const firebaseService = new FirebaseService();
const UserService = require('./services/UserService');
const TeacherSpecificationService = require('./services/TeacherSpecificationService');
const FileUploadService = require('./services/FileUploadService');
const fileUploadMiddleware = require('./middleware/fileUpload');

const userService = new UserService();
const teacherSpecService = new TeacherSpecificationService();
const fileUploadService = new FileUploadService();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload error handling
app.use(fileUploadMiddleware.handleUploadError());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Store active rooms and users
const rooms = new Map();
const users = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Handle user authentication and online status
    socket.on('user-online', async (userId) => {
        try {
            socket.userId = userId;
            await userService.updateOnlineStatus(userId, true);
            console.log(`User ${userId} is now online`);
        } catch (error) {
            console.error('Error updating online status:', error);
        }
    });

    // Join a video call room
    socket.on('join-room', (roomId, userId) => {
        console.log(`User ${userId} joining room ${roomId}`);
        
        socket.join(roomId);
        
        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
        }
        
        rooms.get(roomId).add(userId);
        users.set(socket.id, { roomId, userId });
        
        // Notify others in the room
        socket.to(roomId).emit('user-connected', userId);
        
        // Send current room users to the new user
        const roomUsers = Array.from(rooms.get(roomId));
        socket.emit('room-users', roomUsers);
        
        console.log(`Room ${roomId} users:`, roomUsers);
    });

    // WebRTC signaling - offer
    socket.on('offer', (data) => {
        socket.to(data.roomId).emit('offer', {
            offer: data.offer,
            from: data.userId
        });
    });

    // WebRTC signaling - answer
    socket.on('answer', (data) => {
        socket.to(data.roomId).emit('answer', {
            answer: data.answer,
            from: data.userId
        });
    });

    // WebRTC signaling - ICE candidates
    socket.on('ice-candidate', (data) => {
        socket.to(data.roomId).emit('ice-candidate', {
            candidate: data.candidate,
            from: data.userId
        });
    });

    // Chat messages
    socket.on('send-message', (data) => {
        socket.to(data.roomId).emit('receive-message', {
            message: data.message,
            from: data.userId,
            timestamp: new Date().toISOString()
        });
    });

    // Screen sharing
    socket.on('start-screen-share', (data) => {
        socket.to(data.roomId).emit('screen-share-started', {
            from: data.userId
        });
    });

    socket.on('stop-screen-share', (data) => {
        socket.to(data.roomId).emit('screen-share-stopped', {
            from: data.userId
        });
    });

    // User actions (mute, video off, etc.)
    socket.on('user-action', (data) => {
        socket.to(data.roomId).emit('user-action', {
            action: data.action,
            from: data.userId,
            value: data.value
        });
    });

    // Leave room
    socket.on('leave-room', (data) => {
        const userData = users.get(socket.id);
        if (userData) {
            const { roomId, userId } = userData;
            
            socket.leave(roomId);
            
            // Remove user from room
            if (rooms.has(roomId)) {
                rooms.get(roomId).delete(userId);
                if (rooms.get(roomId).size === 0) {
                    rooms.delete(roomId);
                }
            }
            
            // Notify others
            socket.to(roomId).emit('user-disconnected', userId);
            users.delete(socket.id);
            
            console.log(`User ${userId} left room ${roomId}`);
        }
    });

    // Disconnect
    socket.on('disconnect', async () => {
        const userData = users.get(socket.id);
        if (userData) {
            const { roomId, userId } = userData;
            
            // Remove user from room
            if (rooms.has(roomId)) {
                rooms.get(roomId).delete(userId);
                if (rooms.get(roomId).size === 0) {
                    rooms.delete(roomId);
                }
            }
            
            // Notify others
            socket.to(roomId).emit('user-disconnected', userId);
            users.delete(socket.id);
            
            console.log(`User ${userId} disconnected from room ${roomId}`);
        }
        
        // Update user offline status
        if (socket.userId) {
            try {
                await userService.updateOnlineStatus(socket.userId, false);
                console.log(`User ${socket.userId} is now offline`);
            } catch (error) {
                console.error('Error updating offline status:', error);
            }
        }
        
        console.log('User disconnected:', socket.id);
    });

    // Error handling
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// API Routes
app.get('/api/health', async (req, res) => {
    try {
        // Test Firebase connection by attempting to read from a test collection
        await firebaseService.getCollection('health_check', { limit: 1 });
        
        res.json({ 
            status: 'OK', 
            message: 'Campus Mentor Server is running',
            firebase: 'Connected',
            timestamp: new Date().toISOString(),
            activeRooms: rooms.size,
            activeUsers: users.size
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Server running but Firebase connection failed',
            firebase: 'Disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/rooms', (req, res) => {
    const roomData = {};
    rooms.forEach((users, roomId) => {
        roomData[roomId] = Array.from(users);
    });
    res.json(roomData);
});

app.post('/api/create-room', (req, res) => {
    const roomId = generateRoomId();
    rooms.set(roomId, new Set());
    res.json({ roomId, success: true });
});

// User Management API Routes
app.post('/api/users', async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get('/api/teachers', async (req, res) => {
    try {
        const { limit = 10, search } = req.query;
        let teachers;
        
        if (search) {
            teachers = await userService.searchUsers(search, 'teacher');
        } else {
            teachers = await userService.getTeachers({ limit: parseInt(limit) });
        }
        
        res.json({ success: true, teachers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/users/:id/follow', async (req, res) => {
    try {
        const { targetUserId } = req.body;
        await userService.followUser(req.params.id, targetUserId);
        res.json({ success: true, message: 'User followed successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/api/users/:id/unfollow', async (req, res) => {
    try {
        const { targetUserId } = req.body;
        await userService.unfollowUser(req.params.id, targetUserId);
        res.json({ success: true, message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Teacher Specification API Routes
app.get('/api/teachers/:id/specification', async (req, res) => {
    try {
        const specification = await teacherSpecService.getSpecificationByTeacherId(req.params.id);
        if (!specification) {
            return res.status(404).json({ success: false, error: 'Specification not found' });
        }
        res.json({ success: true, specification });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/teachers/:id/specification', async (req, res) => {
    try {
        const specification = await teacherSpecService.createSpecification(req.params.id, req.body);
        res.status(201).json({ success: true, specification });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.put('/api/teachers/:id/specification', async (req, res) => {
    try {
        const specification = await teacherSpecService.updateSpecification(req.params.id, req.body);
        res.json({ success: true, specification });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/api/teachers/:id/specification/education', async (req, res) => {
    try {
        const education = await teacherSpecService.addEducation(req.params.id, req.body);
        res.status(201).json({ success: true, education });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/api/teachers/:id/specification/certification', async (req, res) => {
    try {
        const certification = await teacherSpecService.addCertification(req.params.id, req.body);
        res.status(201).json({ success: true, certification });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/api/teachers/:id/specification/experience', async (req, res) => {
    try {
        const experience = await teacherSpecService.addExperience(req.params.id, req.body);
        res.status(201).json({ success: true, experience });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get('/api/teachers/search', async (req, res) => {
    try {
        const searchOptions = {
            specialization: req.query.specialization,
            minRate: req.query.minRate ? parseFloat(req.query.minRate) : undefined,
            maxRate: req.query.maxRate ? parseFloat(req.query.maxRate) : undefined,
            teachingMethod: req.query.teachingMethod,
            language: req.query.language,
            minCompletion: req.query.minCompletion ? parseInt(req.query.minCompletion) : 0,
            limit: req.query.limit ? parseInt(req.query.limit) : 20
        };
        
        const teachers = await teacherSpecService.searchTeachers(searchOptions);
        res.json({ success: true, teachers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/teachers/summaries', async (req, res) => {
    try {
        const teacherIds = req.query.ids ? req.query.ids.split(',') : [];
        const summaries = await teacherSpecService.getTeacherSummaries(teacherIds);
        res.json({ success: true, summaries });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// File Upload API Routes
app.post('/api/upload/certification/:teacherId', 
    fileUploadMiddleware.uploadSingle('certification', 'certificate'),
    async (req, res) => {
        try {
            const { teacherId } = req.params;
            const fileMetadata = await fileUploadService.uploadCertification(req.fileInfo, teacherId);
            
            res.status(201).json({ 
                success: true, 
                file: fileUploadService.generateFilePreview(fileMetadata)
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

app.post('/api/upload/profile/:userId',
    fileUploadMiddleware.uploadSingle('profileImage', 'image'),
    async (req, res) => {
        try {
            const { userId } = req.params;
            const fileMetadata = await fileUploadService.uploadProfileImage(req.fileInfo, userId);
            
            // Update user profile with new image URL
            await userService.updateUser(userId, { 
                profileImage: fileMetadata.downloadURL 
            });
            
            res.status(201).json({ 
                success: true, 
                file: fileUploadService.generateFilePreview(fileMetadata)
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

app.post('/api/upload/achievement/:userId',
    fileUploadMiddleware.uploadMultiple('achievementFiles', 5, 'any'),
    async (req, res) => {
        try {
            const { userId } = req.params;
            const filesMetadata = await fileUploadService.uploadAchievementFiles(req.filesInfo, userId);
            
            const filePreviews = filesMetadata.map(file => 
                fileUploadService.generateFilePreview(file)
            );
            
            res.status(201).json({ 
                success: true, 
                files: filePreviews
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

app.delete('/api/files/:userId', async (req, res) => {
    try {
        const { storagePath } = req.body;
        
        if (!storagePath) {
            return res.status(400).json({ 
                success: false, 
                error: 'Storage path is required' 
            });
        }
        
        await fileUploadService.deleteFile(storagePath);
        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// SQLite Database API Routes
// ============================================

// Add a new user to SQLite database
app.post('/api/sqlite/users', async (req, res) => {
    try {
        const { name, email, role } = req.body;
        
        if (!name || !email || !role) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and role are required'
            });
        }
        
        const user = await SQLiteUser.addUser(name, email, role);
        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all users from SQLite database
app.get('/api/sqlite/users', async (req, res) => {
    try {
        const users = await SQLiteUser.getUsers();
        res.json({ success: true, users, count: users.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get a specific user by ID
app.get('/api/sqlite/users/:id', async (req, res) => {
    try {
        const user = await SQLiteUser.getUserById(parseInt(req.params.id));
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get users by role
app.get('/api/sqlite/users/role/:role', async (req, res) => {
    try {
        const users = await SQLiteUser.getUsersByRole(req.params.role);
        res.json({ success: true, users, count: users.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update a user
app.put('/api/sqlite/users/:id', async (req, res) => {
    try {
        const user = await SQLiteUser.updateUser(parseInt(req.params.id), req.body);
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete a user
app.delete('/api/sqlite/users/:id', async (req, res) => {
    try {
        await SQLiteUser.deleteUser(parseInt(req.params.id));
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Search users
app.get('/api/sqlite/users/search/:term', async (req, res) => {
    try {
        const users = await SQLiteUser.searchUsers(req.params.term);
        res.json({ success: true, users, count: users.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user statistics
app.get('/api/sqlite/stats', async (req, res) => {
    try {
        const stats = await SQLiteUser.getUserStats();
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// End of SQLite API Routes
// ============================================

// Utility function to generate room IDs
function generateRoomId() {
    return Math.random().toString(36).substr(2, 9);
}

// Start server
const PORT = process.env.PORT || 3001;

// Initialize SQLite database before starting server
setupDatabase()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`
    🚀 Campus Mentor Server Started!
    
    📍 Local: http://localhost:${PORT}
    🌐 Network: http://YOUR_IP:${PORT}
    
    📊 Features:
    ✅ Video Calls (WebRTC)
    ✅ Real-time Chat
    ✅ Screen Sharing
    ✅ Room Management
    ✅ SQLite Database (campus_mentor.db)
    
    💡 SQLite API Endpoints:
    - POST   /api/sqlite/users          - Add user
    - GET    /api/sqlite/users          - Get all users
    - GET    /api/sqlite/users/:id      - Get user by ID
    - PUT    /api/sqlite/users/:id      - Update user
    - DELETE /api/sqlite/users/:id      - Delete user
    - GET    /api/sqlite/users/role/:role - Get users by role
    - GET    /api/sqlite/users/search/:term - Search users
    - GET    /api/sqlite/stats          - Get statistics
    
    💡 For hackathon demo:
    - Run: node server.js
    - Open: http://localhost:${PORT}/splash.html
    - Test SQLite: node sqlite-demo.js
            `);
        });
    })
    .catch(err => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});