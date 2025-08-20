import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['worker', 'hirer'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either "worker" or "hirer"' },
        { status: 400 }
      );
    }

    // Call Cursor API for registration
    const authResponse = await cursorClient.signUp(email, password, name, role);

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
    console.error('Sign up failed:', error);
    
    let statusCode = 500;
    let errorMessage = 'Sign up failed';

    if (error.code) {
      switch (error.code) {
        case 'EMAIL_ALREADY_EXISTS':
          statusCode = 409;
          errorMessage = 'An account with this email already exists';
          break;
        case 'WEAK_PASSWORD':
          statusCode = 400;
          errorMessage = 'Password is too weak. Please choose a stronger password';
          break;
        case 'INVALID_EMAIL':
          statusCode = 400;
          errorMessage = 'Please enter a valid email address';
          break;
        default:
          statusCode = 400;
          errorMessage = error.message || 'Sign up failed';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 