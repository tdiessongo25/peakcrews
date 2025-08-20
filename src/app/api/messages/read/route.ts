import { NextRequest, NextResponse } from 'next/server';
import { MessagingService } from '@/lib/messaging-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, conversationId } = body;

    if (!userId || !conversationId) {
      return NextResponse.json(
        { error: 'User ID and conversation ID are required' },
        { status: 400 }
      );
    }

    await MessagingService.markAsRead(userId, conversationId);

    return NextResponse.json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error: any) {
    console.error('Failed to mark messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
} 