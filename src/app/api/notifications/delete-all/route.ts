import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // In a real app, this would delete all notifications for the user from the database
    console.log(`Deleting all notifications for user: ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'All notifications deleted',
    });
  } catch (error: any) {
    console.error('Failed to delete all notifications:', error);
    return NextResponse.json(
      { error: 'Failed to delete all notifications' },
      { status: 500 }
    );
  }
} 