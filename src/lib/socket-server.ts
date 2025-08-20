import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { MessagingService } from './messaging-service';
import { NotificationService } from './notification-service';

export interface SocketUser {
  userId: string;
  socketId: string;
  role: string;
}

export class SocketServer {
  private io: SocketIOServer;
  private connectedUsers: Map<string, SocketUser> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002",
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Handle user authentication
      socket.on('authenticate', async (data: { userId: string; role: string }) => {
        const user: SocketUser = {
          userId: data.userId,
          socketId: socket.id,
          role: data.role
        };

        this.connectedUsers.set(data.userId, user);
        socket.join(`user_${data.userId}`);
        
        console.log('User authenticated:', data.userId);
        socket.emit('authenticated', { success: true });
      });

      // Handle joining a conversation
      socket.on('join_conversation', (conversationId: string) => {
        socket.join(`conversation_${conversationId}`);
        console.log('User joined conversation:', conversationId);
      });

      // Handle leaving a conversation
      socket.on('leave_conversation', (conversationId: string) => {
        socket.leave(`conversation_${conversationId}`);
        console.log('User left conversation:', conversationId);
      });

      // Handle sending a message
      socket.on('send_message', async (data: {
        senderId: string;
        receiverId: string;
        jobId?: string;
        content: string;
        type?: 'text' | 'image' | 'file' | 'system';
      }) => {
        try {
          // Save message to database
          const message = await MessagingService.sendMessage(data);
          
          // Get conversation ID
          const conversationId = this.getConversationId(data.senderId, data.receiverId);
          
          // Emit to conversation room
          this.io.to(`conversation_${conversationId}`).emit('new_message', {
            message,
            conversationId
          });

          // Emit to receiver's personal room
          this.io.to(`user_${data.receiverId}`).emit('message_received', {
            message,
            conversationId
          });

          // Send notification to receiver
          try {
            await NotificationService.createNotification({
              userId: data.receiverId,
              title: 'New Message',
              message: `You have a new message from ${data.senderId}`,
              type: 'message',
              isRead: false,
              actionUrl: `/messages?conversation=${conversationId}`
            });
          } catch (error) {
            console.error('Failed to send notification:', error);
          }

          // Send delivery confirmation to sender
          socket.emit('message_sent', { messageId: message.id });

        } catch (error) {
          console.error('Failed to send message:', error);
          socket.emit('message_error', { error: 'Failed to send message' });
        }
      });

      // Handle typing indicators
      socket.on('typing_start', (data: { conversationId: string; userId: string }) => {
        socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
          userId: data.userId,
          isTyping: true
        });
      });

      socket.on('typing_stop', (data: { conversationId: string; userId: string }) => {
        socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
          userId: data.userId,
          isTyping: false
        });
      });

      // Handle message read status
      socket.on('mark_read', async (data: { userId: string; conversationId: string }) => {
        try {
          await MessagingService.markAsRead(data.userId, data.conversationId);
          
          // Emit read status to conversation
          this.io.to(`conversation_${data.conversationId}`).emit('messages_read', {
            userId: data.userId,
            conversationId: data.conversationId
          });
        } catch (error) {
          console.error('Failed to mark messages as read:', error);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        // Remove user from connected users
        for (const [userId, user] of this.connectedUsers.entries()) {
          if (user.socketId === socket.id) {
            this.connectedUsers.delete(userId);
            console.log('User disconnected:', userId);
            break;
          }
        }
      });
    });
  }

  private getConversationId(userId1: string, userId2: string): string {
    const sortedIds = [userId1, userId2].sort();
    return `conv_${sortedIds.join('_')}`;
  }

  // Get connected users
  public getConnectedUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values());
  }

  // Check if user is online
  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Send system message to user
  public sendSystemMessage(userId: string, message: string) {
    this.io.to(`user_${userId}`).emit('system_message', { message });
  }

  // Broadcast to all users
  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }
}
