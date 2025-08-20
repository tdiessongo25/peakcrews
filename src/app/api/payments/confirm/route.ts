import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/stripe-service';
import { NotificationService } from '@/lib/notification-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Confirm the payment intent
    const paymentIntent = await StripeService.confirmPaymentIntent(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Send notifications
      try {
        await NotificationService.createNotification({
          userId: paymentIntent.workerId,
          title: 'Payment Received',
          message: `Payment of $${(paymentIntent.amount / 100).toFixed(2)} has been received for job: ${paymentIntent.description}`,
          type: 'payment_received',
          isRead: false,
          actionUrl: `/payments`,
        });

        await NotificationService.createNotification({
          userId: paymentIntent.hirerId,
          title: 'Payment Completed',
          message: `Payment of $${(paymentIntent.amount / 100).toFixed(2)} has been completed for job: ${paymentIntent.description}`,
          type: 'payment_completed',
          isRead: false,
          actionUrl: `/payments`,
        });
      } catch (notificationError) {
        console.error('Failed to send notifications:', notificationError);
        // Don't fail the payment confirmation if notifications fail
      }

      return NextResponse.json({
        success: true,
        payment_intent: paymentIntent,
        message: 'Payment confirmed successfully',
      });
    } else {
      return NextResponse.json(
        { error: `Payment status is ${paymentIntent.status}` },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Failed to confirm payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to confirm payment' },
      { status: 500 }
    );
  }
} 