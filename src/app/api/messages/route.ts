import { NextRequest, NextResponse } from 'next/server';
import { MessagingService } from '@/lib/messaging-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('conversationId');
    const query = searchParams.get('query');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (conversationId) {
      // Get messages for a specific conversation
      const messages = await MessagingService.getMessages(conversationId);
      return NextResponse.json({
        success: true,
        messages,
      });
    }

    if (query) {
      // Search conversations
      const conversations = await MessagingService.searchConversations(userId, query);
      return NextResponse.json({
        success: true,
        conversations,
      });
    }

    // Get all conversations for the user
    const conversations = await MessagingService.getConversations(userId);
    const unreadCount = await MessagingService.getUnreadCount(userId);

    return NextResponse.json({
      success: true,
      conversations,
      unreadCount,
    });
  } catch (error: any) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, jobId, content, type } = body;

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: 'Sender ID, receiver ID, and content are required' },
        { status: 400 }
      );
    }

    const message = await MessagingService.sendMessage({
      senderId,
      receiverId,
      jobId,
      content,
      type: type || 'text',
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error: any) {
    console.error('Failed to send message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 