const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 9002;

// Prepare the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Create Socket.IO server
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002",
      methods: ["GET", "POST"]
    }
  });

  // Socket.IO event handlers
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user authentication
    socket.on('authenticate', (data) => {
      console.log('User authenticated:', data.userId);
      socket.join(`user_${data.userId}`);
      socket.emit('authenticated', { success: true });
    });

    // Handle joining a conversation
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log('User joined conversation:', conversationId);
    });

    // Handle leaving a conversation
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log('User left conversation:', conversationId);
    });

    // Handle sending a message
    socket.on('send_message', async (data) => {
      try {
        // In a real app, you would save the message to your database here
        const message = {
          id: `msg_${Date.now()}`,
          senderId: data.senderId,
          receiverId: data.receiverId,
          jobId: data.jobId,
          content: data.content,
          type: data.type || 'text',
          status: 'sent',
          createdAt: new Date().toISOString(),
        };

        // Get conversation ID
        const conversationId = `conv_${[data.senderId, data.receiverId].sort().join('_')}`;
        
        // Emit to conversation room
        io.to(`conversation_${conversationId}`).emit('new_message', {
          message,
          conversationId
        });

        // Emit to receiver's personal room
        io.to(`user_${data.receiverId}`).emit('message_received', {
          message,
          conversationId
        });

        // Send delivery confirmation to sender
        socket.emit('message_sent', { messageId: message.id });

        console.log('Message sent:', message);

      } catch (error) {
        console.error('Failed to send message:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
        userId: data.userId,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
        userId: data.userId,
        isTyping: false
      });
    });

    // Handle message read status
    socket.on('mark_read', (data) => {
      // Emit read status to conversation
      io.to(`conversation_${data.conversationId}`).emit('messages_read', {
        userId: data.userId,
        conversationId: data.conversationId
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
