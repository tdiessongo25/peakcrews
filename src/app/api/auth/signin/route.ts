import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Call Cursor API for authentication
    const authResponse = await cursorClient.signIn(email, password);

    // Set authentication cookie
    const response = NextResponse.json({
      success: true,
      user: authResponse.user,
      token: authResponse.token,
      expiresAt: authResponse.expiresAt,
    });

    // Set secure cookie with the token
    response.cookies.set('cursor-session', authResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Sign in failed:', error);
    
    let statusCode = 500;
    let errorMessage = 'Sign in failed';

    if (error.code) {
      switch (error.code) {
        case 'INVALID_CREDENTIALS':
          statusCode = 401;
          errorMessage = 'Invalid email or password';
          break;
        case 'EMAIL_NOT_VERIFIED':
          statusCode = 403;
          errorMessage = 'Please verify your email before signing in';
          break;
        case 'ACCOUNT_DISABLED':
          statusCode = 403;
          errorMessage = 'Your account has been disabled';
          break;
        default:
          statusCode = 400;
          errorMessage = error.message || 'Sign in failed';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 