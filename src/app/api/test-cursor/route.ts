import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.CURSOR_API_BASE_URL || 'https://api.cursor.com';
    const apiKey = process.env.CURSOR_API_KEY;

    console.log('Testing Cursor API from backend...');
    console.log('API URL:', apiUrl);
    console.log('API Key available:', !!apiKey);

    // Test basic connectivity
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (response.ok) {
      return NextResponse.json({
        success: true,
        status: response.status,
        message: 'Cursor API is accessible',
        response: responseText
      });
    } else {
      return NextResponse.json({
        success: false,
        status: response.status,
        message: 'Cursor API returned an error',
        error: responseText
      }, { status: response.status });
    }

  } catch (error: any) {
    console.error('Error testing Cursor API:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to Cursor API',
      error: error.message
    }, { status: 500 });
  }
} 