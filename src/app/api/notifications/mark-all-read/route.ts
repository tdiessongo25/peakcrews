import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get all notifications for the user and mark them as read
    const notifications = await cursorClient.getNotifications(userId);
    
    // In a real app, this would be a bulk update in the database
    const updatedNotifications = await Promise.all(
      notifications.map(notification => 
        cursorClient.markNotificationAsRead(notification.id)
      )
    );

    return NextResponse.json({
      success: true,
      message: 'All notifications marked as read',
      count: updatedNotifications.length,
    });
  } catch (error: any) {
    console.error('Failed to mark all notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark all notifications as read' },
      { status: 500 }
    );
  }
} 