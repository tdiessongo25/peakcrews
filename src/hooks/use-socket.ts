"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import type { Message, Conversation } from '@/lib/messaging-service';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (data: {
    receiverId: string;
    jobId?: string;
    content: string;
    type?: 'text' | 'image' | 'file' | 'system';
  }) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  onNewMessage: (callback: (message: Message) => void) => void;
  onMessageReceived: (callback: (data: { message: Message; conversationId: string }) => void) => void;
  onUserTyping: (callback: (data: { userId: string; isTyping: boolean }) => void) => void;
  onMessagesRead: (callback: (data: { userId: string; conversationId: string }) => void) => void;
}

export function useSocket(): UseSocketReturn {
  const { currentUser, role } = useUser();
  const { toast } = useToast();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageCallbacks = useRef<((message: Message) => void)[]>([]);
  const messageReceivedCallbacks = useRef<((data: { message: Message; conversationId: string }) => void)[]>([]);
  const typingCallbacks = useRef<((data: { userId: string; isTyping: boolean }) => void)[]>([]);
  const readCallbacks = useRef<((data: { userId: string; conversationId: string }) => void)[]>([]);

  // Initialize socket connection
  useEffect(() => {
    if (!currentUser) return;

    // Create socket connection
    const socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      
      // Authenticate user
      socket.emit('authenticate', {
        userId: currentUser.id,
        role: role
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to messaging service.',
        variant: 'destructive',
      });
    });

    // Authentication events
    socket.on('authenticated', (data) => {
      console.log('Socket authenticated:', data);
    });

    // Message events
    socket.on('new_message', (data: { message: Message; conversationId: string }) => {
      console.log('New message received:', data);
      messageCallbacks.current.forEach(callback => callback(data.message));
    });

    socket.on('message_received', (data: { message: Message; conversationId: string }) => {
      console.log('Message received notification:', data);
      messageReceivedCallbacks.current.forEach(callback => callback(data));
    });

    socket.on('message_sent', (data: { messageId: string }) => {
      console.log('Message sent successfully:', data.messageId);
    });

    socket.on('message_error', (data: { error: string }) => {
      console.error('Message error:', data.error);
      toast({
        title: 'Message Error',
        description: data.error,
        variant: 'destructive',
      });
    });

    // Typing events
    socket.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
      console.log('User typing:', data);
      typingCallbacks.current.forEach(callback => callback(data));
    });

    // Read events
    socket.on('messages_read', (data: { userId: string; conversationId: string }) => {
      console.log('Messages read:', data);
      readCallbacks.current.forEach(callback => callback(data));
    });

    // System messages
    socket.on('system_message', (data: { message: string }) => {
      toast({
        title: 'System Message',
        description: data.message,
      });
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [currentUser, role, toast]);

  // Send message
  const sendMessage = useCallback((data: {
    receiverId: string;
    jobId?: string;
    content: string;
    type?: 'text' | 'image' | 'file' | 'system';
  }) => {
    if (!socketRef.current || !currentUser) {
      toast({
        title: 'Connection Error',
        description: 'Not connected to messaging service.',
        variant: 'destructive',
      });
      return;
    }

    socketRef.current.emit('send_message', {
      senderId: currentUser.id,
      receiverId: data.receiverId,
      jobId: data.jobId,
      content: data.content,
      type: data.type || 'text',
    });
  }, [currentUser, toast]);

  // Join conversation
  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join_conversation', conversationId);
    }
  }, []);

  // Leave conversation
  const leaveConversation = useCallback((conversationId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave_conversation', conversationId);
    }
  }, []);

  // Mark messages as read
  const markAsRead = useCallback((conversationId: string) => {
    if (socketRef.current && currentUser) {
      socketRef.current.emit('mark_read', {
        userId: currentUser.id,
        conversationId,
      });
    }
  }, [currentUser]);

  // Start typing
  const startTyping = useCallback((conversationId: string) => {
    if (socketRef.current && currentUser) {
      socketRef.current.emit('typing_start', {
        conversationId,
        userId: currentUser.id,
      });
    }
  }, [currentUser]);

  // Stop typing
  const stopTyping = useCallback((conversationId: string) => {
    if (socketRef.current && currentUser) {
      socketRef.current.emit('typing_stop', {
        conversationId,
        userId: currentUser.id,
      });
    }
  }, [currentUser]);

  // Event listeners
  const onNewMessage = useCallback((callback: (message: Message) => void) => {
    messageCallbacks.current.push(callback);
    return () => {
      const index = messageCallbacks.current.indexOf(callback);
      if (index > -1) {
        messageCallbacks.current.splice(index, 1);
      }
    };
  }, []);

  const onMessageReceived = useCallback((callback: (data: { message: Message; conversationId: string }) => void) => {
    messageReceivedCallbacks.current.push(callback);
    return () => {
      const index = messageReceivedCallbacks.current.indexOf(callback);
      if (index > -1) {
        messageReceivedCallbacks.current.splice(index, 1);
      }
    };
  }, []);

  const onUserTyping = useCallback((callback: (data: { userId: string; isTyping: boolean }) => void) => {
    typingCallbacks.current.push(callback);
    return () => {
      const index = typingCallbacks.current.indexOf(callback);
      if (index > -1) {
        typingCallbacks.current.splice(index, 1);
      }
    };
  }, []);

  const onMessagesRead = useCallback((callback: (data: { userId: string; conversationId: string }) => void) => {
    readCallbacks.current.push(callback);
    return () => {
      const index = readCallbacks.current.indexOf(callback);
      if (index > -1) {
        readCallbacks.current.splice(index, 1);
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    joinConversation,
    leaveConversation,
    markAsRead,
    startTyping,
    stopTyping,
    onNewMessage,
    onMessageReceived,
    onUserTyping,
    onMessagesRead,
  };
}
