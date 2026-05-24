// import express from 'express';
// import cors from 'cors';        //Allowing Cross-Origin Resource Sharing (CORS) to enable communication between the frontend and backend servers, which may be running on different ports during development.
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';        //To read environment variables from a .env file, which is useful for storing sensitive information like database credentials and API keys.
// import authRoutes from './routes/auth.js';   //Importing the authentication routes defined in the auth.js file, which will handle user registration, login, and other authentication-related endpoints.
// import projectRoutes from './routes/projects.js';   //Importing the project routes defined in the projects.js file, which will handle CRUD operations for projects and tasks.
// import overviewRoutes from './routes/overview.js';  //Importing routes to user-specific projects and other projects
// import milestoneRoutes from './routes/milestones.js';
// import celebrationRoute from './routes/celebration.js';
// import profileRoute from './routes/profile.js';

// dotenv.config();
// const app = express();
// app.use(cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',   //Allows requests from the specified client URL, which is typically the frontend application running on a different port during development.
//     credentials: true   //Enables sending cookies and other credentials in cross-origin requests, which is necessary for maintaining user sessions and authentication state between the frontend and backend.
// }));
// app.use(express.json());        //Middleware to parse incoming JSON requests and make the data available in req.body. This is essential for handling API requests that send data in JSON format, such as user registration and login requests.
// app.use(cookieParser());

// app.use('/api/auth', authRoutes);   //Mounts the authentication routes defined in the authRoutes module at the '/api/auth' path. This means that any requests to endpoints like '/api/auth/register' or '/api/auth/login' will be handled by the corresponding route handlers defined in the authRoutes module.
// app.use('/api/projects', projectRoutes);   //Mounts the project routes defined in the projectRoutes module at the '/api/projects' path. This means that any requests to endpoints like '/api/projects' will be handled by the corresponding route handlers defined in the projectRoutes module.
// app.use('/api', overviewRoutes);
// app.use('/api', milestoneRoutes);
// app.use('/api', celebrationRoute);
// app.use('/api', profileRoute)

// const Port = process.env.PORT || 5000;
// app.listen(Port, () => {        //Server listens on port 5000
//   console.log(`Server is running on port ${Port}`);
// });

import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import your existing routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import profileRoutes from './routes/profile.js';
import milestoneRoutes from './routes/milestones.js';
import overviewRoutes from './routes/overview.js';  //Importing routes to user-specific projects and other projects
import celebrationRoute from './routes/celebration.js';
import commentRoutes from './routes/comments.js';
import collaborateRoutes from './routes/collaborators.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Your React app URL
    credentials: true,
  },
});

// ========== EXISTING MIDDLEWARE ==========
app.use(cors({
  origin: "https://mzans-ibuilds.onrender.com",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ========== EXISTING ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', profileRoutes);
app.use('/api', milestoneRoutes); // or whatever path you use
app.use('/api', overviewRoutes);
app.use('/api', celebrationRoute);
app.use('/api/comments', commentRoutes);
app.use('/api', collaborateRoutes)

// ========== SOCKET.IO CODE (ADD THIS) ==========
// Store online users and their socket IDs
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Register user with their userId
  socket.on('register-user', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Handle comment notifications
  socket.on('send-comment', (data) => {
    const { projectOwnerId, projectTitle, commenterName, commenterEmail, commentText, projectId } = data;
    
    const ownerSocketId = onlineUsers.get(projectOwnerId);
    
    if (ownerSocketId) {
      io.to(ownerSocketId).emit('new-notification', {
        type: 'comment',
        title: 'New Comment',
        message: `${commenterName} <${commenterEmail}> commented on your project "${projectTitle}": "${commentText.substring(0, 50)}${commentText.length > 50 ? '...' : ''}"`,
        projectId: projectId,
        projectTitle: projectTitle,
        timestamp: new Date().toISOString()
      });
      console.log(`Comment notification sent to user ${projectOwnerId}`);
    }
  });

  // Handle raise hand / collaboration request
  socket.on('raise-hand', (data) => {
    const { projectOwnerId, projectTitle, requesterName, requesterEmail, projectId } = data;
    
    const ownerSocketId = onlineUsers.get(projectOwnerId);
    
    if (ownerSocketId) {
      io.to(ownerSocketId).emit('new-notification', {
        type: 'collaboration',
        title: 'Collaboration Request',
        message: `${requesterName}<${requesterEmail}> is interested in collaborating on your project "${projectTitle}"`,
        projectId: projectId,
        projectTitle: projectTitle,
        requesterName: requesterName,
        timestamp: new Date().toISOString()
      });
      console.log(`Collaboration request sent to user ${projectOwnerId}`);
    }
  });

  // Handle mark as read
  socket.on('mark-read', (notificationId) => {
    console.log(`Notification ${notificationId} marked as read`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});
// ========== END OF SOCKET.IO CODE ==========

// Basic test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
