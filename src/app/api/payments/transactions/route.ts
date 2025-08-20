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

    // Get payment intents and escrow accounts
    const paymentIntents = await PaymentService.getPaymentIntents(userId, role);
    const escrowAccounts = await PaymentService.getEscrowAccounts(userId, role);

    // Convert to transaction format
    const transactions = [
      ...paymentIntents.map(pi => ({
        id: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        status: pi.status,
        type: 'payment' as const,
        jobId: pi.jobId,
        description: pi.description,
        createdAt: pi.createdAt,
        completedAt: pi.completedAt,
      })),
      ...escrowAccounts.map(escrow => ({
        id: escrow.id,
        amount: escrow.amount,
        currency: escrow.currency,
        status: escrow.status === 'funded' ? 'pending' : escrow.status === 'released' ? 'completed' : 'failed',
        type: 'escrow' as const,
        jobId: escrow.jobId,
        description: `Escrow for Job #${escrow.jobId}`,
        createdAt: escrow.createdAt,
        completedAt: escrow.releasedAt,
      })),
    ];

    // Sort by creation date (newest first)
    transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      transactions,
    });
  } catch (error: any) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
