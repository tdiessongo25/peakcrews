import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  try {
    const { notificationId } = await params;

    const notification = await cursorClient.markNotificationAsRead(notificationId);

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error: any) {
    console.error('Failed to mark notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
} 