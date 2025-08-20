import { NextRequest, NextResponse } from 'next/server';
import { AdminSetup } from '@/lib/admin-setup';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, setupKey } = body;

    // Validate required fields
    if (!email || !password || !name || !setupKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: email, password, name, and setupKey are required' 
        },
        { status: 400 }
      );
    }

    // Create admin account
    const result = await AdminSetup.createInitialAdmin(
      { email, password, name, role: 'admin' },
      setupKey
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        adminEmail: email,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during admin setup' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return setup instructions and requirements
    const instructions = AdminSetup.getSetupInstructions();
    
    return NextResponse.json({
      success: true,
      instructions,
      requirements: {
        passwordLength: 12,
        passwordComplexity: ['uppercase', 'lowercase', 'numbers', 'symbols'],
        emailRequired: true,
        setupKeyRequired: true,
      },
    });
  } catch (error: any) {
    console.error('Failed to get setup instructions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get setup instructions' },
      { status: 500 }
    );
  }
}
