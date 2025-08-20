import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';

export async function POST(request: NextRequest) {
  try {
    // Call Cursor API to sign out
    await cursorClient.signOut();

    // Clear the authentication cookie
    const response = NextResponse.json({
      success: true,
      message: 'Successfully signed out',
    });

    // Remove the session cookie
    response.cookies.set('cursor-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error: any) {
    console.error('Sign out failed:', error);
    
    // Even if the API call fails, clear the local cookie
    const response = NextResponse.json({
      success: true,
      message: 'Successfully signed out',
    });

    // Remove the session cookie
    response.cookies.set('cursor-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
    });

    return response;
  }
} 