import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';

export async function GET(request: NextRequest) {
  try {
    // For development, always return a user
    // In production, check for session cookie
    const sessionCookie = request.cookies.get('cursor-session');
    
    // Get the current user from Cursor API
    const user = await cursorClient.getCurrentUser();

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Failed to get current user:', error);
    
    let statusCode = 500;
    let errorMessage = 'Failed to get current user';

    if (error.code) {
      switch (error.code) {
        case 'UNAUTHORIZED':
          statusCode = 401;
          errorMessage = 'Not authenticated';
          break;
        default:
          statusCode = 400;
          errorMessage = error.message || 'Failed to get current user';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 