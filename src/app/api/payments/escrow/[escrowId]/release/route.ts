import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/stripe-service';
import { NotificationService } from '@/lib/notification-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ escrowId: string }> }
) {
  try {
    const { escrowId } = await params;
    const body = await request.json();
    const { userId, role } = body;

    if (!escrowId || !userId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Verify the escrow account exists and belongs to the user
    // 2. Check if the user has permission to release the escrow
    // 3. Verify the job is completed and ready for payment

    // For now, we'll simulate the escrow release
    const escrowAmount = 50000; // $500.00 in cents
    const workerStripeAccountId = 'acct_worker_test'; // This should come from worker's profile

    // Create transfer to worker's account
    const transfer = await StripeService.createTransfer({
      amount: escrowAmount,
      currency: 'usd',
      destination: workerStripeAccountId,
      description: `Escrow release for job ${escrowId}`,
      metadata: {
        jobId: escrowId,
        workerId: userId,
        hirerId: 'hirer_id', // This should come from escrow data
      },
    });

    // Send notifications
    try {
      await NotificationService.createNotification({
        userId: userId, // Worker
        title: 'Escrow Released',
        message: `Escrow funds of $${(escrowAmount / 100).toFixed(2)} have been released to your account.`,
        type: 'escrow_released',
        isRead: false,
        actionUrl: `/payments`,
      });

      await NotificationService.createNotification({
        userId: 'hirer_id', // Hirer
        title: 'Escrow Released',
        message: `Escrow funds of $${(escrowAmount / 100).toFixed(2)} have been released to the worker.`,
        type: 'escrow_released',
        isRead: false,
        actionUrl: `/payments`,
      });
    } catch (notificationError) {
      console.error('Failed to send notifications:', notificationError);
      // Don't fail the escrow release if notifications fail
    }

    return NextResponse.json({
      success: true,
      transfer_id: transfer.id,
      amount: escrowAmount,
      message: 'Escrow funds released successfully',
    });
  } catch (error: any) {
    console.error('Failed to release escrow:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to release escrow' },
      { status: 500 }
    );
  }
} 