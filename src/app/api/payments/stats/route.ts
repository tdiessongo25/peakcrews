import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role') as 'hirer' | 'worker';

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    // Get basic payment stats
    const basicStats = await PaymentService.getPaymentStats(userId);

    // Calculate monthly stats
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // In a real implementation, you would filter transactions by date
    // For now, we'll simulate monthly data
    const thisMonthAmount = role === 'worker' ? basicStats.totalEarned * 0.3 : basicStats.totalPaid * 0.3;
    const lastMonthAmount = role === 'worker' ? basicStats.totalEarned * 0.2 : basicStats.totalPaid * 0.2;

    const stats = {
      ...basicStats,
      thisMonth: Math.round(thisMonthAmount),
      lastMonth: Math.round(lastMonthAmount),
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Failed to fetch payment stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment stats' },
      { status: 500 }
    );
  }
}
