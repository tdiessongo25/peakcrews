import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/lib/admin-service';

export async function GET(request: NextRequest) {
  try {
    // Get admin dashboard statistics
    const stats = await AdminService.getAdminStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('Failed to get admin stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get admin stats' },
      { status: 500 }
    );
  }
}
