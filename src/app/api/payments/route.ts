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

    const paymentIntents = await PaymentService.getPaymentIntents(userId, role);
    const escrowAccounts = await PaymentService.getEscrowAccounts(userId, role);
    const paymentStats = await PaymentService.getPaymentStats(userId);

    return NextResponse.json({
      success: true,
      paymentIntents,
      escrowAccounts,
      paymentStats,
    });
  } catch (error: any) {
    console.error('Failed to fetch payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'payment-intent') {
      const paymentIntent = await PaymentService.createPaymentIntent(data);
      return NextResponse.json({
        success: true,
        paymentIntent,
      });
    }

    if (type === 'escrow') {
      const escrowAccount = await PaymentService.createEscrowAccount(data);
      return NextResponse.json({
        success: true,
        escrowAccount,
      });
    }

    return NextResponse.json(
      { error: 'Invalid payment type' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Failed to create payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
} 