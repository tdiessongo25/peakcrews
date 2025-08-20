// Messaging service for real-time communication between workers and hirers
// In a real app, this would integrate with WebSocket or similar real-time services

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  jobId?: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  jobId?: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MessageNotification {
  id: string;
  userId: string;
  messageId: string;
  conversationId: string;
  type: 'new_message' | 'message_read' | 'system';
  isRead: boolean;
  createdAt: string;
}

export class MessagingService {
  // Mock conversations for development
  private static mockConversations: Conversation[] = [
    {
      id: 'conv_1',
      participants: ['user1', 'hirer1'],
      jobId: '1',
      unreadCount: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'conv_2',
      participants: ['user1', 'hirer2'],
      jobId: '2',
      unreadCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ];

  // Mock messages for development
  private static mockMessages: Message[] = [
    {
      id: 'msg_1',
      senderId: 'hirer1',
      receiverId: 'user1',
      jobId: '1',
      content: 'Hi! I saw your application for the electrical repair job. When can you start?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      readAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    },
    {
      id: 'msg_2',
      senderId: 'user1',
      receiverId: 'hirer1',
      jobId: '1',
      content: 'I can start tomorrow morning at 9 AM. Is that convenient for you?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      readAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    },
    {
      id: 'msg_3',
      senderId: 'hirer1',
      receiverId: 'user1',
      jobId: '1',
      content: 'Perfect! I\'ll be home then. Please bring your tools and safety equipment.',
      type: 'text',
      status: 'delivered',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'msg_4',
      senderId: 'user1',
      receiverId: 'hirer1',
      jobId: '1',
      content: 'Will do! I have all the necessary equipment. See you tomorrow.',
      type: 'text',
      status: 'sent',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 'msg_5',
      senderId: 'hirer2',
      receiverId: 'user1',
      jobId: '2',
      content: 'Thanks for applying to the plumbing job. Can you provide a quote?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      readAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ];

  // Mock notifications
  private static mockNotifications: MessageNotification[] = [
    {
      id: 'notif_1',
      userId: 'user1',
      messageId: 'msg_3',
      conversationId: 'conv_1',
      type: 'new_message',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'notif_2',
      userId: 'user1',
      messageId: 'msg_4',
      conversationId: 'conv_1',
      type: 'new_message',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
  ];

  // Get conversations for a user
  static async getConversations(userId: string): Promise<Conversation[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.mockConversations.filter(conv => 
      conv.participants.includes(userId)
    ).map(conv => ({
      ...conv,
      lastMessage: this.mockMessages
        .filter(msg => msg.senderId === conv.participants[0] || msg.receiverId === conv.participants[0])
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0],
    }));
  }

  // Get messages for a conversation
  static async getMessages(conversationId: string): Promise<Message[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const conversation = this.mockConversations.find(conv => conv.id === conversationId);
    if (!conversation) {
      return [];
    }

    return this.mockMessages
      .filter(msg => 
        (msg.senderId === conversation.participants[0] && msg.receiverId === conversation.participants[1]) ||
        (msg.senderId === conversation.participants[1] && msg.receiverId === conversation.participants[0])
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Send a new message
  static async sendMessage(data: {
    senderId: string;
    receiverId: string;
    jobId?: string;
    content: string;
    type?: 'text' | 'image' | 'file' | 'system';
  }): Promise<Message> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: data.senderId,
      receiverId: data.receiverId,
      jobId: data.jobId,
      content: data.content,
      type: data.type || 'text',
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    this.mockMessages.push(message);

    // Update conversation
    const conversationId = this.getConversationId(data.senderId, data.receiverId);
    let conversation = this.mockConversations.find(conv => conv.id === conversationId);
    
    if (!conversation) {
      conversation = {
        id: conversationId,
        participants: [data.senderId, data.receiverId],
        jobId: data.jobId,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.mockConversations.push(conversation);
    } else {
      conversation.updatedAt = new Date().toISOString();
      conversation.unreadCount += 1;
    }

    // Create notification
    const notification: MessageNotification = {
      id: `notif_${Date.now()}`,
      userId: data.receiverId,
      messageId: message.id,
      conversationId: conversation.id,
      type: 'new_message',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.mockNotifications.push(notification);

    console.log('Sent message:', message);
    return message;
  }

  // Mark messages as read
  static async markAsRead(userId: string, conversationId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const conversation = this.mockConversations.find(conv => conv.id === conversationId);
    if (!conversation) return;

    // Mark messages as read
    this.mockMessages.forEach(msg => {
      if (msg.receiverId === userId && msg.status !== 'read') {
        msg.status = 'read';
        msg.readAt = new Date().toISOString();
      }
    });

    // Reset unread count
    conversation.unreadCount = 0;

    // Mark notifications as read
    this.mockNotifications.forEach(notif => {
      if (notif.userId === userId && notif.conversationId === conversationId) {
        notif.isRead = true;
      }
    });

    console.log('Marked conversation as read:', conversationId);
  }

  // Get unread message count for a user
  static async getUnreadCount(userId: string): Promise<number> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.mockConversations
      .filter(conv => conv.participants.includes(userId))
      .reduce((total, conv) => total + conv.unreadCount, 0);
  }

  // Get message notifications for a user
  static async getNotifications(userId: string): Promise<MessageNotification[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.mockNotifications.filter(notif => 
      notif.userId === userId && !notif.isRead
    );
  }

  // Create or get conversation ID
  private static getConversationId(userId1: string, userId2: string): string {
    const sortedIds = [userId1, userId2].sort();
    return `conv_${sortedIds.join('_')}`;
  }

  // Search conversations
  static async searchConversations(userId: string, query: string): Promise<Conversation[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const conversations = await this.getConversations(userId);
    
    if (!query) return conversations;

    return conversations.filter(conv => {
      const messages = this.mockMessages.filter(msg => 
        (msg.senderId === conv.participants[0] && msg.receiverId === conv.participants[1]) ||
        (msg.senderId === conv.participants[1] && msg.receiverId === conv.participants[0])
      );
      
      return messages.some(msg => 
        msg.content.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  // Delete a message (for sender only)
  static async deleteMessage(messageId: string, userId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const messageIndex = this.mockMessages.findIndex(msg => 
      msg.id === messageId && msg.senderId === userId
    );
    
    if (messageIndex !== -1) {
      this.mockMessages.splice(messageIndex, 1);
      console.log('Deleted message:', messageId);
    }
  }
} 